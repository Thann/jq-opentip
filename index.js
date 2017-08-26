// jQuery Tooltip plugin that extends OpenTip.

var jQuery = require('jquery');
var Opentip = require('opentip');
require('opentip/css/opentip.css');
require('imports?jQuery=jquery!jquery-visible');

var default_opts = {
	showOn: 'click mouseover',
	hideOn: 'mouseout',
	group: 'default',

	// ==== New options ====
	hideOnBodyClick: true,
	scrollReposition: true,

	// By default: Look at the elements attributes to set the content.
	content: function() {
		return jQuery(this).attr('data-ot') || jQuery(this).attr('tooltip');
	},
};

var bodyListener = undefined;
function enableBodyListener() { // Closes all tooltips when the body is clicked.
	// Hide all tooltips unless one is being clicked or opened.
	if (!bodyListener) bodyListener = jQuery('body').on('click', function(ev) {
		var f = _(Opentip.tips).find(function(t) {
			// Find if the click-target was an opentip trigger OR inside a opentip
			return t.options.target[0] == ev.target ||
				t.container && jQuery(ev.target).closest(t.container).length;
		});

		if (!f) _(Opentip.tips).each(function(t) {
			if (t.options.hideOnBodyClick) t.hide();
		});
	});
};

jQuery.fn.Opentip = function jqOpenTip(opts) {
	var tips = [];
	var targets = [];
	var options = _.extend({}, default_opts, opts);

	this.each(function() {
		targets.push(this);

		var content = (typeof options.content == 'function')?
			options.content.apply(this): options.content;

		var tip = new Opentip(this, content, _.extend({target: this}, options));
		tips.push(tip);
	});

	if (options.scrollReposition) {
		// Add scroll listeners to all scroll parents.
		jQuery(targets).scrollParents().each(function() {
			jQuery(this).on('scroll', function() {
				_(tips).each(function(t) {
					if (t.visible)
						t.options.target.visible(false)? t.reposition(): t.hide();
				});
			});
		});
	}

	if (options.hideOnBodyClick) enableBodyListener();
	return tips; //TODO: this?
};

// Almost entirely stolen from https://github.com/slindberg/jquery-scrollparent
jQuery.fn.scrollParents = function() {
	var overflowRegex = /(auto|scroll)/,
  position = this.css( "position" ),
  excludeStaticParent = position === "absolute",
  scrollParent = this.parents().filter( function() {
    var parent = jQuery( this );
    if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
      return false;
    }
    var overflowState = parent.css(["overflow", "overflowX", "overflowY"]);
    return (overflowRegex).test( overflowState.overflow + overflowState.overflowX + overflowState.overflowY );
  });

  return position === "fixed" || !scrollParent.length ? jQuery( this[ 0 ].ownerDocument || document ) : scrollParent;
};

