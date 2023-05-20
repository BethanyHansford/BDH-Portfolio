
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
		  });

// Function to handle slideshow animation
function startSlideshow() {
	var slideshowImages = document.querySelectorAll(".slider img");
	var currentImage = 0;
	var intervalId;
  
	function fadeOut() {
	  slideshowImages[currentImage].style.opacity = 0;
	}
  
	function fadeIn() {
	  slideshowImages[currentImage].style.opacity = 1;
	}
  
	function nextImage() {
	  fadeOut();
	  currentImage = (currentImage + 1) % slideshowImages.length;
	  fadeIn();
	}
  
	function startInterval() {
	  intervalId = setInterval(nextImage, 5000); // Change image every 5 seconds
	}
  
	function stopInterval() {
	  clearInterval(intervalId);
	}
  
	// Initial setup
	fadeIn();
	startInterval();
  
	// Slider nav element
	var sliderNav = document.querySelector(".slider-nav");
  
	// Button event listeners
	var prevButton = document.getElementById("prevButton");
	var nextButton = document.getElementById("nextButton");
  
	prevButton.addEventListener("click", function (event) {
	  event.preventDefault();
	  fadeOut();
	  currentImage = (currentImage - 1 + slideshowImages.length) % slideshowImages.length;
	  fadeIn();
	  stopInterval();
	});
  
	nextButton.addEventListener("click", function (event) {
	  event.preventDefault();
	  fadeOut();
	  currentImage = (currentImage + 1) % slideshowImages.length;
	  fadeIn();
	  stopInterval();
	});
  }
  
  // Call the function when the page is loaded
  window.addEventListener("load", startSlideshow);

		  
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
