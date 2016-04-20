#############################################################################
# Program:
#    Lab FinalProj, Computer Communication and Networking
#    Brother Jones, CS 460
# Author:
#    McKay Smalley
# Summary:
#    This is a chat server, that keeps track of the connections. When a 
#    message is recieved, it is transmitted to all the connected clients.
#############################################################################
import sys
from socket import *
import select

DEFAULT_PORT = 6789
SOCKET_LIST = []
RECV_BUFFER = 4096

# broadcast chat messages to all connected clients
def broadcast( server_socket, sock, message ):
   for socket in SOCKET_LIST:
      # send the message only to peer
      if socket != server_socket :
         try :
            socket.send(message)
         except :
            # broken socket connection
            socket.close()
            # broken socket, remove it
            if socket in SOCKET_LIST:
               SOCKET_LIST.remove(socket)

def main():
   serverPort = int( sys.argv[1] ) if len( sys.argv ) == 2 else DEFAULT_PORT

   try:
      server_socket = socket( AF_INET, SOCK_STREAM )
      server_socket.setsockopt( SOL_SOCKET, SO_REUSEADDR, 1 )   
      server_socket.bind( ( '', serverPort ) )
      server_socket.listen( 10 ) 

      SOCKET_LIST.append( server_socket )

      localhost = gethostbyname( gethostname() )
      print 'Serving at', localhost, 'on port', serverPort


      while True:

         ready_to_read,ready_to_write,in_error = select.select(SOCKET_LIST,[],[],0)
      
         for sock in ready_to_read:
            # a new connection request recieved
            if sock == server_socket: 
               sockfd, addr = server_socket.accept()
               SOCKET_LIST.append(sockfd)
               print "New Connection @ [%s:%s]" % sockfd.getpeername()
             
            # a message from a client
            else:

               try:
                  message = sock.recv(RECV_BUFFER)
                  sys.stdout.write( message )
                  if message:
                     message = "\r" + message
                     broadcast( server_socket, sock, message )  
                  else:
                     if sock in SOCKET_LIST:
                        SOCKET_LIST.remove(sock)

                        print "[%s:%s] is offline\n" % addr

               except:
                  print "[%s:%s] is offline\n" % addr
                  continue

      server_socket.close()

   except KeyboardInterrupt:
      server_socket.close()

   except Exception, e:
      print e

if __name__ == "__main__":
   main()
