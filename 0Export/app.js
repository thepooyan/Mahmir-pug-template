$(function () {
  //*query framework
  (function () {
    let dc = {
      query: (e) => {
        return query(document, e);
      },
      queries: (e) => {
        return queries(document, e);
      },
      id: (e) => {
        return getId(document, e);
      }
    }
    function getId(ele, trgt) {
      return querify(ele.getElementById(trgt))
    }
    function query(ele, trgt) {
      return querify(ele.querySelector(trgt))
    }
    function queries(ele, trgt) {
      return querify(ele.querySelectorAll(trgt))
    }

    function querify(ele) {
      if (!ele) return
      ele.query = (e) => query(ele, e);
      ele.queries = (e) => queries(ele, e);
      return ele
    }
    window.dc = dc;
  })()

  //* onclick system
  refreshOnClicks();
  function refreshOnClicks() {
    let clicker = dc.queries("[data-onClick]");

    clicker.forEach(item => {
      if (item.getAttribute('data-group')) {

        if (!item.clickEvent) {
          item.clickEvent = true;
          item.addEventListener("click", function () {
            dc.queries(`[data-group=${item.getAttribute('data-group')}`).forEach(item => {
              item.classList.remove(item.getAttribute("data-onClick"));
            })
            item.classList.toggle(item.getAttribute("data-onClick"));
          });
        }

      } else {

        if (!item.clickEvent) {
          item.clickEvent = true;
          item.addEventListener("click", function () {
            item.classList.toggle(item.getAttribute("data-onClick"));
          });
        }

      }
    })
  }

  //* Target system (grouped and single)
  let targeter = dc.queries('[data-target]');
  targeter.forEach(i => {
    let target = dc.query(i.dataset.target);
    if (target.dataset.group) {
      i.addEventListener('click', function () {
        dc.queries(`[data-group=${target.dataset.group}]`).forEach(item => {
          item.classList.remove('active');
        })
        target.classList.add('active');
      })
    } else {
      i.addEventListener('click', function () {
        target.classList.toggle('active');
      })
    }
  })

  //* Add smooth scrolling to all links
  $("a").on('click', function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      window.location.hash = hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top + -30
      }, 900, function () {

      });
    }
  });
})