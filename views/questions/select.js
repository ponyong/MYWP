$('#title_selecter').click(function () {
  var selected = $("#title_selecter > option:selected").text();
  $('#TITLE').val(selected);
});

$('#TANK_NUM').click(function () {
  var selected = $("#TANK_NUM > option:selected").text();
  $('#TANKER').val(selected);
});

$('#DEALER_NUM').click(function () {
  var selected = $("#DEALER_NUM > option:selected").text();
  $('#DEALER').val(selected);
});

$('#BUFFER_NUM').click(function () {
  var selected = $("#BUFFER_NUM > option:selected").text();
  $('#BUFFER').val(selected);
});

$('#HEALER_NUM').click(function () {
  var selected = $("#HEALER_NUM > option:selected").text();
  $('#HEALER').val(selected);
});
