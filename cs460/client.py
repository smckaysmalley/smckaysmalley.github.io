#############################################################################
# Program:
#    Lab FinalProj, Computer Communication and Networking
#    Brother Jones, CS 460
# Author:
#    McKay Smalley
# Summary:
#    This is a chat client that sends text messages to a server. The 
#    was done using the curses library.
#############################################################################
import curses
import sys
import select
import socket
import time
import thread

DEFAULT_HOST = 'aus213l27'
DEFAULT_PORT = 6789
SLEEP_DELAY  = 0.05

class Client:

   def __init__( self ):
      # socket setup
      self.s    = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      host      = sys.argv[1] if len( sys.argv ) >= 2 else DEFAULT_HOST
      port      = int( sys.argv[2] ) if len( sys.argv ) >= 3 else DEFAULT_PORT


      # connect to server
      try :
         self.s.connect( ( host, port ) )
      except :
         print 'Unable to connect', host, port
         sys.exit()

      # UI setup
      self.username   = raw_input( "Enter a username: " )

      self.s.send( "[" + self.username + "] joined the chat room. \n" )

      self.screen     = curses.initscr()
      self.win_height = self.screen.getmaxyx()[0]
      self.win_width  = self.screen.getmaxyx()[1]
      self.input_line = curses.newwin( 1, self.win_width, 0, 0 )
      self.chat_win   = curses.newwin( self.win_height, self.win_width, 1, 0)
      self.dialogue   = []

      curses.curs_set( 0 )

   def run( self ):
      try:
         thread.start_new_thread( self.listen_for_messages, ( ) )
         self.get_user_input()
         
      except KeyboardInterrupt:
         self.s.send( "[" + self.username + "] left the chat room. \n" )
         self.s.close()
         curses.endwin()

   def get_user_input( self ):
      while True:
         self.input_line.addstr( 0, 0, "> " )
         self.input_line.refresh()
         text = self.input_line.getstr( 0, 2, 64 )
         message = '[' + self.username + '] ' + text + '\n'
         self.s.send( message )

         # sleep, so that the redrawing does not interupt other thread
         time.sleep(SLEEP_DELAY) 
         
         self.input_line.clear()

   def listen_for_messages( self ):
      time.sleep(SLEEP_DELAY)
      while True:
         try:

            message = self.s.recv( 4096 )

            if len( self.dialogue )+1 >= self.win_height:
               self.dialogue.pop()

            self.dialogue.insert( 0, message )
            self.chat_win.clear()

            for i, text in enumerate( self.dialogue ):
               self.chat_win.addstr( i, 0, text )
            
            self.chat_win.refresh()

         except Exception, e:
            "DO NOTHING"
            # curses.endwin()
            print e
            # time.sleep(2)
            # self.dialogue.pop()

if __name__ == "__main__":
   sys.exit( Client().run() )
