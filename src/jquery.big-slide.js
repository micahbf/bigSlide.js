(function($) {
  'use strict';

  $.fn.bigSlide = function(options) {
    // store the menuLink in a way that is globally accessible
    var menuLink = this;

    // plugin settings
    var settings = $.extend({
      'menu': ('#menu'),
      'push': ('.push'),
      'side': 'left',
      'menuWidth': '15.625em',
      'speed': '300',
      'state': 'closed',
      'easyClose': false
    }, options);

    // store the menu's state in the model
    var model = {
      'state': settings.state
    };

    // talk back and forth between the view and state
    var controller = {
      init: function(){
        view.init();
      },
      // update the menu's state
      changeState: function(){
        if (model.state === 'closed') {
          model.state = 'open'
        } else {
          model.state = 'closed'
        }
      },
      // check the menu's state
      getState: function(){
        return model.state;
      }
    };

    // the view contains all of the visual interactions
    var view = {
      init: function(){
        // cache DOM values
        this.$menu = $(settings.menu);
        this.$push = $(settings.push);
        this.width = settings.menuWidth;

        // CSS for how the menu will be positioned off screen
        var positionOffScreen = {
          'position': 'fixed',
          'top': '0',
          'bottom': '0',
          'height': '100%'
        };

        // manually add the settings values
        var sideSign = (settings.side === 'left') ? -1 : 1;
        positionOffScreen['-webkit-transform'] = 'translate(' + (sideSign * settings.menuWidth) + ', 0)';
        positionOffScreen['-moz-transform'] = 'translate(' + (sideSign * settings.menuWidth) + ', 0)';
        positionOffScreen['-ms-transform'] = 'translate(' + (sideSign * settings.menuWidth) + ', 0)';
        positionOffScreen['-o-transform'] = 'translate(' + (sideSign * settings.menuWidth) + ', 0)';
        positionOffScreen['transform'] = 'translate(' + (sideSign * settings.menuWidth) + ', 0)';
        positionOffScreen.width = settings.menuWidth;

        // add the css values to position things offscreen
        if (settings.state === 'closed') {
          this.$menu.css(positionOffScreen);
          this.$push.css(settings.side, '0');
        }

        // settings for positioning on screen
        var positionOnScreen = {
          '-webkit-transform': 'translate(0, 0)',
          '-moz-transform': 'translate(0, 0)',
          '-ms-transform': 'translate(0, 0)',
          '-o-transform': 'translate(0, 0)',
          'transform': 'translate(0, 0)'
        };

        // css for the sliding animation
        var animateSlide = {
          '-webkit-transition': '-webkit-transform ' + settings.speed + 'ms ease',
          '-moz-transition': '-moz-transform ' + settings.speed + 'ms ease',
          '-ms-transition': '-ms-transform ' + settings.speed + 'ms ease',
          '-o-transition': '-o-transform ' + settings.speed + 'ms ease',
          'transition': 'transform ' + settings.speed + 'ms ease'
        };

        // add the animation css
        this.$menu.css(animateSlide);
        this.$push.css(animateSlide);

        // register a click listener for desktop & touchstart for mobile
        menuLink.on('click.bigSlide touchstart.bigSlide', function(e) {
          e.preventDefault();
          if (controller.getState() === 'open') {
            view.toggleClose();
          } else {
            view.toggleOpen();
          }
        });

        // this makes my eyes blead, but adding it back in as it's a highly requested feature
        if (settings.easyClose) {
          $('body').on('click.bigSlide', function(e) {
           if (!$(e.target).parents().andSelf().is(menuLink) && controller.getState() === 'open')  {
             view.toggleClose();
           }
          });
        }
      },

      // toggle the menu open
      toggleOpen: function() {
        controller.changeState();
        this.$menu.css(this.view.positionOnScreen);
        this.$push.css(settings.side, this.width);
        //menuLink.addClass(settings.activeBtn);
      },

      // toggle the menu closed
      toggleClose: function() {
        controller.changeState();
        this.$menu.css(this.view.positionOffScreen);
        this.$push.css(settings.side, '0');
        //menuLink.removeClass(settings.activeBtn);
      }

    }

    controller.init();

  };

}(jQuery));
