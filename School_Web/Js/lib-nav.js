// 学院分馆和学科导航下拉的辅助交互（尽量保持纯 CSS；JS 用于键盘/触屏与容错）
(function () {
  // 学院分馆
  var collegeNavItem = document.querySelector('.navbar .nav .nav-item.has-mega:not(.subject-nav)');
  if (collegeNavItem) {
    var collegeLink = collegeNavItem.querySelector('.nav-link');
    var collegePanel = collegeNavItem.querySelector('.mega-panel');
    
    function setCollegeExpanded(state) {
      collegeNavItem.setAttribute('aria-expanded', state ? 'true' : 'false');
      if (state) {
        collegePanel.style.opacity = '1';
        collegePanel.style.pointerEvents = 'auto';
      } else {
        collegePanel.style.opacity = '';
        collegePanel.style.pointerEvents = '';
      }
    }

    collegeLink.setAttribute('tabindex', '0');
    collegeLink.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var open = collegeNavItem.getAttribute('aria-expanded') === 'true';
        setCollegeExpanded(!open);
      }
      if (e.key === 'Escape') setCollegeExpanded(false);
    });

    document.addEventListener('click', function (e) {
      if (!collegeNavItem.contains(e.target)) setCollegeExpanded(false);
    });

    var collegeTouched = false;
    collegeLink.addEventListener('touchend', function (e) {
      var open = collegeNavItem.getAttribute('aria-expanded') === 'true';
      if (!open && !collegeTouched) {
        e.preventDefault();
        collegeTouched = true;
        setCollegeExpanded(true);
        setTimeout(function(){ collegeTouched = false; }, 500);
      }
    });
  }

  // 学科导航
  var subjectNavItem = document.querySelector('.navbar .nav .nav-item.has-mega.subject-nav');
  if (subjectNavItem) {
    var subjectLink = subjectNavItem.querySelector('.nav-link');
    var subjectPanel = subjectNavItem.querySelector('.subject-mega-panel');

    
    function setSubjectExpanded(state) {
      subjectNavItem.setAttribute('aria-expanded', state ? 'true' : 'false');
      if (state) {
        subjectPanel.style.opacity = '1';
        subjectPanel.style.pointerEvents = 'auto';
      } else {
        subjectPanel.style.opacity = '';
        subjectPanel.style.pointerEvents = '';
      }
    }

    subjectLink.setAttribute('tabindex', '0');
    subjectLink.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var open = subjectNavItem.getAttribute('aria-expanded') === 'true';
        setSubjectExpanded(!open);
      }
      if (e.key === 'Escape') setSubjectExpanded(false);
    });

    document.addEventListener('click', function (e) {
      if (!subjectNavItem.contains(e.target)) setSubjectExpanded(false);
    });

    var subjectTouched = false;
    subjectLink.addEventListener('touchend', function (e) {
      var open = subjectNavItem.getAttribute('aria-expanded') === 'true';
      if (!open && !subjectTouched) {
        e.preventDefault();
        subjectTouched = true;
        setSubjectExpanded(true);
        setTimeout(function(){ subjectTouched = false; }, 500);
      }
    });
  }
})();


