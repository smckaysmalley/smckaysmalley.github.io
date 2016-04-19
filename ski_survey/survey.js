function verify()
{
    return $('input:radio:checked').length > 0;
}

function submit()
{
   if ( verify() )
   {
      var msg = "Thank you!"
      $('#submit-status-message').html(msg);
      $('#submit-message').fadeIn()
      $('#submit-message').delay(5000).fadeOut()
   }
}