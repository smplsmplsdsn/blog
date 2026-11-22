/**
 * 検索条件をコーディングする
 */
const setSearchMaker = () => {
  let html = '',
      i;
  
  DATA_MAKER = arrayDelDouble(DATA_MAKER);
  
  for (i in DATA_MAKER) {
    html += `
<label>
  <input type="checkbox" name="maker" value="${DATA_MAKER[i]}">
  <span>${DATA_MAKER[i]}</span>
</label>
    `;
  }
  
  $(".js-label-maker").html(html);
}