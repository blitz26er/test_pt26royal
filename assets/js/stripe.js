var publicStripeApiKey = 'pk_live_inuc5aq7dBSYwlcsOi0BZYkX';
var publicStripeApiKeyTesting = 'pk_test_kFy12fPBXQv0cpuU9eHSWLtG';

Stripe.setPublishableKey(publicStripeApiKeyTesting);


var stripeResponseHandler = function(status, response) {
  var $form = $('#payment-form');
  console.log(response);
  if (response.error) {
    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);
  } else {
    // token contains id, last4, and card type
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and submit
    $form.get(0).submit();
  }
};

jQuery(function($) {
  $('#payment-form').submit(function(event) {
    var $form = $(this);
    console.log($form);

    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);

    Stripe.createToken($form, stripeResponseHandler);
	
    // Prevent the form from submitting with the default action
    return false;
  });
});

