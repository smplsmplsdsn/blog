$(function () {
  
  $('.js-form').on('submit', function () {
    search();
    return false;
  })
  
  $('.js-form-submit').on('click', function () {
    $('.js-form').submit();
    return false;
  })
});