/*
	Alpha by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			wide:      ( '1281px',  '1680px' ),
			normal:    ( '981px',   '1280px' ),
			narrow:    ( '737px',   '980px'  ),
			narrower:  ( '737px',   '840px'  ),
			mobile:    ( '481px',   '736px'  ),
			mobilep:   ( null,      '480px'  )
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			alignment: 'right'
		});

	// NavPanel.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// NavPanel submenu toggles (mobile).
		(function() {
			var $navPanel = $('#navPanel');
			if ($navPanel.length === 0)
				return;

			var $links = $navPanel.find('.link');

			var getDepth = function($link) {
				var match = /depth-(\d+)/.exec($link.attr('class') || '');
				return match ? parseInt(match[1], 10) : 0;
			};

			var $genericSuiteLink = $links.filter(function() {
				return $(this).text().trim() === 'Generic Suite';
			}).first();

			if ($genericSuiteLink.length === 0)
				return;

			var parentDepth = getDepth($genericSuiteLink);
			var $children = $();

			$genericSuiteLink.nextAll('.link').each(function() {
				var $child = $(this);
				var depth = getDepth($child);

				if (depth <= parentDepth)
					return false;

				$children = $children.add($child);
			});

			if ($children.length === 0)
				return;

			var setExpanded = function(expanded) {
				$genericSuiteLink
					.toggleClass('is-expanded', expanded)
					.toggleClass('is-collapsed', !expanded)
					.attr('aria-expanded', expanded);

				$children.toggleClass('is-hidden', !expanded);
				$genericSuiteLink.find('.nav-toggle').text(expanded ? '▾' : '▸');
			};

			$children.addClass('nav-child is-hidden');
			$genericSuiteLink
				.addClass('nav-parent is-collapsed')
				.attr('aria-expanded', 'false')
				.append('<span class="nav-toggle" role="button" aria-label="Toggle Generic Suite submenu" tabindex="0">▸</span>');

			setExpanded(false);

			$navPanel.on('click', '.nav-toggle', function(event) {
				event.preventDefault();
				event.stopPropagation();
				setExpanded(!$genericSuiteLink.hasClass('is-expanded'));
			});

			$navPanel.on('keydown', '.nav-toggle', function(event) {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					$(this).trigger('click');
				}
			});
		})();

	// Header.
		if (!browser.mobile
		&&	$header.hasClass('alt')
		&&	$banner.length > 0) {

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt reveal'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			});

		}

})(jQuery);