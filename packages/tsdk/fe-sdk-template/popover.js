window.onload = function () {
  console.log('Init popover');
  let id = 0;
  let timer = 0;

  $('body .col-content').delegate('a', 'mouseenter mouseleave', function (e) {
    const $target = $(e.target);

    // Skip links without href attribute or internal page links
    if (!$target.attr('href')) {
      return;
    }
    if ($target.attr('href').indexOf('#') > -1) {
      return;
    }

    // Skip "Defined in" links
    if (
      $target.parent() &&
      $target.parent().text() &&
      $target.parent().text().startsWith('Defined in')
    ) {
      return;
    }

    let currentId = id;

    if (e.type === 'mouseenter') {
      // Remove any existing popover
      $(`[data-popover="${currentId}"]`).unbind().remove();

      // Increment ID for new popover
      id++;
      currentId = id;

      fetch($target.attr('href'))
        .then((res) => res.text())
        .then((res) => {
          const $html = $(res);
          const $content = $html.find('.col-content');
          const { top, left } = $target.offset();

          // Calculate available space
          const viewportHeight = $(window).height();
          const viewportWidth = $(window).width();
          const popoverHeight = 400; // Max height of popover
          const popoverWidth = 400; // Width of popover
          const linkHeight = $target.outerHeight();

          // Position the popover below AND with an offset to the right
          // This ensures the link remains clickable
          let topPos = top + linkHeight + 15; // 5px gap
          let leftPos = left + 20; // Offset to the right

          // If there's not enough room below, position it above
          if (topPos + popoverHeight > viewportHeight) {
            topPos = Math.max(10, top - popoverHeight - 25); // 15px gap above
          }

          // Ensure it doesn't go off-screen horizontally
          if (leftPos + popoverWidth > viewportWidth) {
            leftPos = Math.max(10, viewportWidth - popoverWidth - 20);
          }

          // Apply styles to popover
          $content.attr(
            'style',
            `position: absolute; 
             top: ${topPos}px; 
             left: ${leftPos}px;
             width: 400px;
             padding: 10px;
             border-radius: 10px;
             max-width: 100%;
             max-height: 400px;
             overflow-y: auto;
             font-size: 14px; 
             background: #fff;
             z-index: 9999;
             box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;`
          );

          $content.attr('data-popover', currentId);
          $content.find('.tsd-breadcrumb').remove();

          // Handle mouse events on the popover itself
          $content.on('mouseenter mouseleave', function (e) {
            if (e.type === 'mouseenter') {
              clearTimeout(timer);
            } else {
              $(`[data-popover="${currentId}"]`).unbind().remove();
            }
          });

          $('body').append($content);
        })
        .catch((error) => {
          console.error('Error fetching content:', error);
        });
    } else {
      // On mouseleave, remove popover after delay
      timer = setTimeout(function () {
        $(`[data-popover="${currentId}"]`).unbind().remove();
      }, 200);
    }
  });
};
