(function($) {
  Drupal.behaviors.tingSearchAutocomplete = {
    attach: function(context) {
      var input_selector = '.block-search-form form input[name="search_block_form"]';

      $(input_selector).autocomplete({
        minLength: 3,
        source: function(request, response) {
          $.getJSON(Drupal.settings.basePath + 'ting/autocomplete', {
            query: request.term
          }, response);
        },
        search: function(event, ui) {
          // When a search is beginning, show the spinner
          $(input_selector).addClass('spinner');
        },
        open: function(event, ui) {
          // When a search is done, use this, to hide the spinner.
          $(input_selector).removeClass('spinner');
        },
        select: function(event, ui) {
          // Add the chosen value to the searchbox and submit.
          if (ui.item) {
            $(input_selector).val(ui.item.value);
            $('#search-block-form').submit();
          }
        }
      });
    }
  };
} (jQuery));
