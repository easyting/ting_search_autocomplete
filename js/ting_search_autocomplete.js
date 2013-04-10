(function($) {
    /*
     * Function enabling the advanced search feature.
     **/
    jQuery.fn.tingEnableAdvancedSearch = function(){
      // Show advanced search  
      $(".fieldset-legend").show();
      // Enable autocomplete
      $(this).autocomplete({
        minLength: 3,
        source: function(request, response) {
          jsonReq = $.getJSON(Drupal.settings.basePath + 'ting/autocomplete', {
            query: request.term
          }, response);
        },
        search: function(event, ui) {
          // When a search is beginning, show the spinner
          $(this).addClass('spinner');
        },
        open: function(event, ui) {
          // When a search is done, use this, to hide the spinner.
          $(this).removeClass('spinner');
        },
        select: function(event, ui) {
          // Add the chosen value to the searchbox and submit.
          if (ui.item) {
            $(this).val(ui.item.value);
            $('#search-block-form').submit();
          }
        }
      });        
    };
    /*
     * Function disabling the advanced search feature.
     **/    
    jQuery.fn.tingDisableAdvancedSearch = function(){
      // Hide advanced search
     $(".fieldset-legend").hide();
     if((this['selector']+'spinner').length>0){
       $(this).removeClass('spinner');
     }
      // Disable autocomplete  
      $(this).autocomplete({
        // Overwrite source
        source: [],
        // Overwrite search
        search: function(event, ui) {
        },
        // Overwrite open function
        open: function(event, ui) {
        },
        // Overwrite select function
        select: function(event, ui) {
        }
      });        
    };
    // Register event for clicking MATERIAL
    $('input#edit-search-provider-ting.form-radio').live('click', function() {
      $('#edit-search-block-form--2').tingEnableAdvancedSearch();
    }); 
    // Register event for clicking WEBSITE
    $('input#edit-search-provider-node.form-radio').live('click', function() {
      $('#edit-search-block-form--2').tingDisableAdvancedSearch(); 
    });
    // Register event for clicking E-RESOURCES
    $('input#edit-search-provider-meta.form-radio').live('click', function() {
      $('#edit-search-block-form--2').tingDisableAdvancedSearch();
    });
    Drupal.behaviors.tingSearchAutocomplete = {
    attach: function(context) {
        $('#edit-search-block-form--2').tingEnableAdvancedSearch();
    }
  };
} (jQuery));

