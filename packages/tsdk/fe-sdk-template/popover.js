window.onload = function () {
  console.log('Init popover');

  let id = 0;
  let timer = 0;
  $('body .col-content').delegate('a', 'mouseenter mouseleave', function (e) {
    const $target = $(e.target);
    if (!$target.attr('href')) {
      return;
    }
    if ($target.attr('href').indexOf('#') > -1) {
      return;
    }
    if (
      $target.parent() &&
      $target.parent().text() &&
      $target.parent().text().startsWith('Defined in')
    ) {
      return;
    }

    let currentId = id;

    if (e.type === 'mouseenter') {
      $(`[data-popover=${id}]`).unbind().remove();
      id++;
      currentId = id;

      fetch(e.target.href)
        .then((res) => res.text())
        .then((res) => {
          const $html = $(res);
          const $content = $html.find('.col-content');
          const { top, left } = $target.offset();
          $content.attr(
            'style',
            `position: absolute; top: ${
              top + $target.outerHeight()
            }px; left: ${left}px;width: 400px;padding: 10px;border-radius: 10px;max-width: 100%;max-height: 400px;overflow-y: auto;font-size: 14px; background: #fff;box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;`
          );
          $content.attr('data-popover', currentId);
          $content.find('.tsd-breadcrumb').remove();
          $content.on('mouseenter mouseleave', function (e) {
            if (e.type === 'mouseenter') {
              clearTimeout(timer);
            } else {
              $(`[data-popover=${currentId}]`).unbind().remove();
            }
          });
          $('body').append($content);
        });
    } else {
      timer = setTimeout(function () {
        $(`[data-popover=${currentId}]`).unbind().remove();
      }, 200);
    }
  });
};
