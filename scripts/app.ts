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
  
    //! ------my validation
    function checkValidation(element) {
      const vaidationProiorities = {
        notEmpty: 0,
        length: 2,
        number: 1,
        email: 1,
      }
      let validation = JSON.parse(element.dataset.validate);
      let msgBox = element.nextElementSibling;
      element.errorList = {};
  
      function addError(err, msg) {
        element.errorList[err] = { order: vaidationProiorities[err], content: msg };
      }
      function removeError(key) {
        delete element.errorList[key]
      }
      function errorCheck(condition, msg, vali, proiority) {
        if (typeof condition === 'function')
          condition = condition()
  
        if (condition) {
          addError(vali, msg, proiority)
        } else {
          removeError(vali)
        }
      }
      function validateEmail(email) {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
      function runValidation(vali, value) {
        switch (vali) {
          case 'notEmpty':
            errorCheck(value === '', 'لطفا کادر را خالی نگذارید!', vali)
            break;
          case 'length':
            errorCheck(value.length != element.dataset.length, `طول کاراکتر وارد شده باید ${element.dataset.length} باشد`, vali)
            break;
          case 'number':
            errorCheck(_ => isNaN(value), 'فرمت کاراکتر وارد شده صحیح نمیباشد', vali)
            break;
          case 'email':
            errorCheck(_ => !validateEmail(value), 'ایمیل وارد شده نادرست میباشد', vali)
            break;
        }
      }
  
      if (!msgBox || !msgBox.classList.contains('validationMsg')) {
        console.log(element)
        console.log(`above logged input has no validation box. please add a span with "validationMsg" classname next to it!`)
        return;
      }
  
      validation.forEach(vali => {
        runValidation(vali, element.value)
      })
    }
  
    function alertValidationErrs(element, reject) {
      let msgBox = element.nextElementSibling;
  
      if (Object.keys(element.errorList).length === 0)
        msgBox.classList.remove('show');
      else {
        let HigherOrder = Object.values(element.errorList).reduce((p, c) => p.order < c.order ? p : c).order;
  
        let targetErrors = Object.values(element.errorList).filter(i => i.order === HigherOrder);
  
        targetErrors.forEach((i, index) => {
          if (index === 0) {
            msgBox.innerHTML = i.content;
          } else {
            msgBox.innerHTML += ` و ${i.content}`;
          }
          msgBox.classList.add('show');
          reject && reject();
        })
      }
    }
  
    //*validate section
    function validateSection(section) {
      return new Promise((resolve, reject) => {
        section.queries('[data-validate]').forEach(i => {
          checkValidation(i);
          alertValidationErrs(i, reject);
        });
        resolve();
      })
    }
    //* set all vaidations
    function setValidations() {
      dc.queries('[data-validate]').forEach(i => {
        i.onkeyup = () => {
          checkValidation(i);
          alertValidationErrs(i);
        }
      });
    }
    setValidations();
  
    //profile edit validations
    let editProfile = dc.query('form.editProfile');
    editProfile.errors = editProfile.query('.errors');
  
    editProfile.onsubmit = (e) => {
      e.preventDefault();
  
      validateSection(editProfile).then(_ => {
        alert('ok!')
      }).catch(_ => {
        editProfile.errors.innerHTML = 'اطلاعات وارد شده صحیح نمیباشد';
        editProfile.errors.classList.add('show');
      })
    }
  
    //side munu click
    const sideMenu = dc.query('#profile aside')
  
    console.log('sdf');
    console.log(sideMenu);
    sideMenu.onclick = e => {
      if (e.target === sideMenu)
      alert('sdf')
    }
  })
  