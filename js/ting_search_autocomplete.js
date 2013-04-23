(function($) {
  Drupal.behaviors.tingSearchAutocomplete = {
    attach: function(context) {

      var autocomplete_settings = {
        minLength: 3,
        source: function(request, response) {
          $.getJSON(Drupal.settings.basePath + 'ting/autocomplete', {
            query: request.term
          }, response);
        },
        search: function(event, ui) {
          // When a search is beginning, show the spinner
          $('#edit-search-block-form--2').addClass('spinner');
        },
        open: function(event, ui) {
          // When a search is done, use this, to hide the spinner.
          $('#edit-search-block-form--2').removeClass('spinner');
        },
        select: function(event, ui) {
          // Add the chosen value to the searchbox and submit.
          if (ui.item) {
            $('#edit-search-block-form--2').val(ui.item.value);
            $('#search-block-form').submit();
          }
        }
      };

      // Override the settings, making the autocomplete disabled.
      if (Drupal.settings.ting_search_autocomplete.autocomplete_enabled === false) {
        autocomplete_settings = {
          source: function() {

          }
        };
      }

      $('#edit-search-block-form--2').autocomplete(autocomplete_settings);
    }
  };
} (jQuery));

