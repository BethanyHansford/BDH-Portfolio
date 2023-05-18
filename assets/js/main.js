
(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

		document.addEventListener('DOMContentLoaded', function() {
			var visualIdentityText = document.getElementById('visual-identity');
			var texts = ['Visual Identity', 'Branding', 'Packaging', 'Illustration'];
			var currentIndex = 0;
		
			function changeText() {
			  currentIndex = (currentIndex + 1) % texts.length;
			  typeText();
			  setTimeout(eraseText, 3000);
			}
		
			function typeText() {
			  var text = texts[currentIndex];
			  var charIndex = 0;
			  visualIdentityText.textContent = '';
			  var interval = setInterval(function() {
				visualIdentityText.textContent += text[charIndex];
				charIndex++;
				if (charIndex === text.length) {
				  clearInterval(interval);
				  setTimeout(changeText, 3000);
				}
			  }, 100);
			}
		
			function eraseText() {
			  var text = visualIdentityText.textContent;
			  var charIndex = text.length - 1;
			  var interval = setInterval(function() {
				visualIdentityText.textContent = text.substring(0, charIndex);
				charIndex--;
				if (charIndex < 0) {
				  clearInterval(interval);
				}
			  }, 50);
			}
		
			changeText();
		
			var canvas = document.getElementById('canvas');
			var context = canvas.getContext('2d');
			var pencilTrail = [];
			var trailFadeInterval;
		
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		
			function startTrail(event) {
			  var pencil = {
				x: event.clientX,
				y: event.clientY,
				opacity: 1
			  };
			  pencilTrail.push(pencil);
			  clearInterval(trailFadeInterval);
			  trailFadeInterval = setInterval(function() {
				fadeTrail();
			  }, 50);
			  drawTrail();
			}
		
			function moveTrail(event) {
			  var pencil = {
				x: event.clientX,
				y: event.clientY,
				opacity: 1
			  };
			  pencilTrail.push(pencil);
			  drawTrail();
			}
		
			function endTrail() {
			  clearInterval(trailFadeInterval);
			}
		
			function fadeTrail() {
			  context.clearRect(0, 0, canvas.width, canvas.height);
			  for (var i = 0; i < pencilTrail.length; i++) {
				pencilTrail[i].opacity -= 0.01;
				if (pencilTrail[i].opacity <= 0) {
				  pencilTrail.splice(i, 1);
				  i--;
				}
			  }
			  drawTrail();
			}
		
			function drawTrail() {
			  context.clearRect(0, 0, canvas.width, canvas.height);
			  context.fillStyle = 'black';
			  context.strokeStyle = 'black';
			  context.lineWidth = 2;
		
			  for (var i = 0; i < pencilTrail.length; i++) {
				var pencil = pencilTrail[i];
				context.globalAlpha = pencil.opacity;
				context.beginPath();
				context.arc(pencil.x, pencil.y, 5, 0, 2 * Math.PI);
				context.fill();
				context.stroke();
			  }
			}
		
			document.addEventListener('mousedown', startTrail);
			document.addEventListener('mousemove', moveTrail);
			document.addEventListener('mouseup', endTrail);
		  });


	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Forms.
		var $form = $('form');

		// Auto-resizing textareas.
			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');

				// Fix.
					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});

	// Menu.
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

})(jQuery);