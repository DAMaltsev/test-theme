

    /* add your custom script here */

    
    
    
    
    
    
(function( jQuery ){
  // var $module = jQuery('#m-1623162674932').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
    
    
    
    
    
    
    
    
(function( jQuery ){
  // var $module = jQuery('#m-1623229263416').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
    
    
    
    
    
    (function( jQuery ){
  // var $module = jQuery('#m-1622541917238').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
    
    
    
    
    
    
    
    
    
    
    
    jQuery(function() {
  var mode = jQuery('.gryffeditor').hasClass('editing') ? 'dev' : 'production';
  var $module = jQuery('#m-1618578703740').children('.module');
  if (mode == 'dev') {
      jQuery('#m-1618578703740').attr('data-name', '').css('background-image', 'none').removeAttr('data-image');
      
      var flag = true;
      var $bkLiquid = parent.jQuery('body').find('#gfFrame').contents().find('#module-1618578703740');
      if ($bkLiquid && $bkLiquid.length > 0) {
          var $settings = $bkLiquid.find('.settings');
          try {
              var name = '';
              var imageUrl = '';
              settings = JSON.parse($settings.html());
              for (var i = 0; i < settings.length; i++) {
                  if (settings[i].name == 'name') {
                      name = settings[i].default_value
                  }
                  if (settings[i].name == 'image') {
                      imageUrl = settings[i].default_value
                  }
              }
              if (imageUrl != '') {
                  flag = false;
                  jQuery('#m-1618578703740').css('background-image', 'url(' + imageUrl + ')').css('min-height', '100px').attr('data-image', 'true');
              }
              if (name != '' && name != 'Custom Code') {
                  flag = false;
                  jQuery('#m-1618578703740').attr('data-name', name);
              }
          } catch(error) {
              console.log(error);
          }
      }
      if (flag) {
          jQuery('#m-1618578703740').attr('data-name', 'Right click on the module, then choose Edit Html / Liquid option to start writing your custom code.');
      }
  }
});
    
    (function( jQuery ){
  // var $module = jQuery('#m-1622541917238').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
    
    
    
    
    
    
    
    
    
    
    
    
    jQuery(function() {
  var mode = jQuery('.gryffeditor').hasClass('editing') ? 'dev' : 'production';
  var $module = jQuery('#m-1618578703740').children('.module');
  if (mode == 'dev') {
      jQuery('#m-1618578703740').attr('data-name', '').css('background-image', 'none').removeAttr('data-image');
      
      var flag = true;
      var $bkLiquid = parent.jQuery('body').find('#gfFrame').contents().find('#module-1618578703740');
      if ($bkLiquid && $bkLiquid.length > 0) {
          var $settings = $bkLiquid.find('.settings');
          try {
              var name = '';
              var imageUrl = '';
              settings = JSON.parse($settings.html());
              for (var i = 0; i < settings.length; i++) {
                  if (settings[i].name == 'name') {
                      name = settings[i].default_value
                  }
                  if (settings[i].name == 'image') {
                      imageUrl = settings[i].default_value
                  }
              }
              if (imageUrl != '') {
                  flag = false;
                  jQuery('#m-1618578703740').css('background-image', 'url(' + imageUrl + ')').css('min-height', '100px').attr('data-image', 'true');
              }
              if (name != '' && name != 'Custom Code') {
                  flag = false;
                  jQuery('#m-1618578703740').attr('data-name', name);
              }
          } catch(error) {
              console.log(error);
          }
      }
      if (flag) {
          jQuery('#m-1618578703740').attr('data-name', 'Right click on the module, then choose Edit Html / Liquid option to start writing your custom code.');
      }
  }
});
    
    
    
    
    