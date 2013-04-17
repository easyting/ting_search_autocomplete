(function($) {
    /**
     * Function enabling the advanced search feature.
     **/
    jQuery.fn.tingEnableAdvancedSearch = function(){
      // Show advanced search.
      $(".fieldset-legend").show();
	  $(".block-search-form form .extendsearch-advanced").addClass('enabled');
      // Enable autocomplete.
      $(this).autocomplete({
        minLength: 3,
        source: function(request, response) {
          jsonReq = $.getJSON(Drupal.settings.basePath + 'ting/autocomplete', {
            query: request.term
          }, response);
        },
        search: function(event, ui) {
          // When a search is beginning, show the spinner.
          $(this).addClass('spinner');
		  $(this).parent().addClass('spinner-wrapper');
        },
        open: function(event, ui) {
          // When a search is done, use this, to hide the spinner.
          $(this).removeClass('spinner');
		  $(this).parent().removeClass('spinner-wrapper');
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
    /**
     * Function disabling the advanced search feature.
     **/    
    jQuery.fn.tingDisableAdvancedSearch = function(){
      // Hide advanced search
     $(".fieldset-legend").hide();
	 $(".block-search-form form .extendsearch-advanced").removeClass('enabled');
     if((this['selector']+'spinner').length>0){
       $(this).removeClass('spinner');
       $(this).parent().removeClass('spinner-wrapper');
     }
      // Disable autocomplete.  
      $(this).autocomplete({
        // Overwrite source function.
        source: [],
        // Overwrite search function.
        search: function(event, ui) {
        },
        // Overwrite open function.
        open: function(event, ui) {
        },
        // Overwrite select function.
        select: function(event, ui) {
        }
      });        
    };
    /**
     * Function moves advanced search values to default search field.
     **/    
    jQuery.fn.tingMoveAdvancedSearchValues = function(){
      if($('#edit-search-block-form--2').val()){
        $('#edit-search-block-form--2').data('default', $('#edit-search-block-form--2').data('default')||$('#edit-search-block-form--2').val());
      }
      else {
        $('#edit-search-block-form--2').data('default', false);
      }
      defaultFieldValue = $('#edit-search-block-form--2').data('default') == '' ? $('#edit-search-block-form--2').val() : $('#edit-search-block-form--2').data('default');
      var advancedFieldsValue = defaultFieldValue;
      $('.block-search-form .extendsearch-advanced input').each(function() {
        if ($(this).val().length > 0) {
          advancedFieldsValue += " " + $(this).val();
        }
      });
      $('.block-search-form form .ui-autocomplete-input').val(advancedFieldsValue);
    };
    // Register event for clicking MATERIAL.
    $('input#edit-search-provider-ting.form-radio').live('click', function() {
      $('#edit-search-block-form--2').tingEnableAdvancedSearch();
    }); 
    // Register event for clicking WEBSITE and E-RESOURCES.
    $('input#edit-search-provider-node.form-radio, input#edit-search-provider-meta.form-radio').live('click', function() {
      $('#edit-search-block-form--2').tingDisableAdvancedSearch();
      $('#edit-search-block-form--2').tingMoveAdvancedSearchValues();
    });
    Drupal.behaviors.tingSearchAutocomplete = {
    attach: function(context) {
      $('#edit-search-block-form--2').tingEnableAdvancedSearch();
    }
  };
} (jQuery));

