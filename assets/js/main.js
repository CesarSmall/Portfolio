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
			if ($links.length === 0)
				return;

			var getDepth = function($link) {
				var match = /depth-(\d+)/.exec($link.attr('class') || '');
				return match ? parseInt(match[1], 10) : 0;
			};

			var linkData = [];
			$links.each(function(index) {
				var $link = $(this);
				linkData.push({
					$link: $link,
					depth: getDepth($link),
					index: index,
					parentIndex: null,
					hasChildren: false
				});
			});

			for (var i = 0; i < linkData.length; i++) {
				var current = linkData[i];
				for (var j = i - 1; j >= 0; j--) {
					if (linkData[j].depth === current.depth - 1) {
						current.parentIndex = j;
						break;
					}
				}
				if (current.parentIndex !== null)
					linkData[current.parentIndex].hasChildren = true;
			}

			var $genericSuiteLink = $links.filter(function() {
				return $(this).text().trim() === 'Generic Suite';
			}).first();

			if ($genericSuiteLink.length === 0)
				return;

			var genericSuiteIndex = null;
			for (var k = 0; k < linkData.length; k++) {
				if (linkData[k].$link.is($genericSuiteLink)) {
					genericSuiteIndex = k;
					break;
				}
			}

			if (genericSuiteIndex === null)
				return;

			var setExpanded = function($link, expanded) {
				$link
					.toggleClass('is-expanded', expanded)
					.toggleClass('is-collapsed', !expanded)
					.attr('aria-expanded', expanded);

				$link.find('.nav-toggle').text(expanded ? '▾' : '▸');
			};

			var isWithinGenericSuite = function(itemIndex) {
				var parentIndex = linkData[itemIndex].parentIndex;
				while (parentIndex !== null) {
					if (parentIndex === genericSuiteIndex)
						return true;
					parentIndex = linkData[parentIndex].parentIndex;
				}
				return false;
			};

			var refreshVisibility = function() {
				linkData.forEach(function(item, itemIndex) {
					if (itemIndex === genericSuiteIndex || !isWithinGenericSuite(itemIndex)) {
						item.$link.removeClass('is-hidden');
						return;
					}

					var shouldHide = false;
					var parentIndex = item.parentIndex;
					while (parentIndex !== null) {
						var parent = linkData[parentIndex];
						if (parentIndex === genericSuiteIndex && parent.$link.hasClass('is-collapsed')) {
							shouldHide = true;
							break;
						}
						if (parentIndex !== genericSuiteIndex && parent.$link.hasClass('is-collapsed')) {
							shouldHide = true;
							break;
						}
						parentIndex = parent.parentIndex;
					}
					item.$link.toggleClass('is-hidden', shouldHide);
				});
			};

			linkData.forEach(function(item, itemIndex) {
				if (!item.hasChildren)
					return;

				if (itemIndex !== genericSuiteIndex && !isWithinGenericSuite(itemIndex))
					return;

				item.$link
					.addClass('nav-parent is-collapsed')
					.attr('aria-expanded', 'false');

				if (item.$link.find('.nav-toggle').length === 0) {
					item.$link.append('<span class="nav-toggle" role="button" aria-label="Toggle submenu" tabindex="0">▸</span>');
				}
			});

			linkData.forEach(function(item, itemIndex) {
				if (item.hasChildren && (itemIndex === genericSuiteIndex || isWithinGenericSuite(itemIndex)))
					setExpanded(item.$link, false);
			});

			refreshVisibility();

			$navPanel.on('click', '.nav-toggle', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var $parentLink = $(this).closest('.link');
				setExpanded($parentLink, !$parentLink.hasClass('is-expanded'));
				refreshVisibility();
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