const client = window.supabaseClient;

const dest_map = new Map([
  ["広島バスセンター", "セ"],
  ["横川駅前", "横"],
  ["中広町", "中"],
  ["市役所前", "役"],
  ["五日市駅北口", "五"],
  ["紙屋町", "紙"],
  ["広島港桟橋", "港"],
  ["くすの木台", "く"],
  ["あさひが丘下", "あ"],
  ["こころ南中央", "南"],
  ["こころ産業団地", "産"],
  ["こころ西風梅苑", "梅"],
  ["市立大学前", "大"],
  ["花の季台", "花"],
  ["ジアウトレット広島", "ジ"],
  ["ジ アウトレット 広島", "ジ"],
  ["アルパーク", "ア"],
  ["そらの北", "そ"],
  ["免許センター", "免"],
  ["広島修道大学キャンパス", "修"],
  ["藤の木団地", "藤"],
]);

const sorting_key = [
  // 市内方面
  "市立大学前",
  "横川駅前",
  "中広町",
  "紙屋町",
  // 郊外、石内方面
  "広島修道大学キャンパス",
  "免許センター",
  "ジ アウトレット 広島",
  "ジアウトレット広島",
  "アルパーク",
];

// データ取得関数
async function fetchAndDisplayData(table_name) {
  const session = await requireAuth();

  if (!session) {
    // console.log("Authorization Error. To login page.");
    window.location.href = "login.html";
    return; // 認証されていない場合は処理を中断
  }
  // 最新のバス時刻のデータをSupabaseから取得
  const { data: univ_data, error: error_u } = await client
    .from(table_name)
    .select("*")
    .order("time", { ascending: true });

  let last_hour = "0";
  let hour;
  let minute;
  let tr = null;
  let td;
  let busItem;
  let shortName;
  let dest;
  let timeEl;
  let destList;
  let destText;
  const table = document.getElementById("timetable_data");

  table.innerHTML = ""
  for (ichi_bus of univ_data) {
    trip_id = ichi_bus.trip_id;
    time = ichi_bus.time;
    route_short_name = ichi_bus.route_short_name;
    route_long_name = ichi_bus.route_long_name;
    source_stop = ichi_bus.source_stop;
    destination_stop = ichi_bus.stop_headsign;
    via_stop = ichi_bus.via_stop;

    [hour, minute] = time.split(":");

    if (last_hour != hour) {
      td = document.createElement("td");
      if (tr) {
        table.appendChild(tr);
      }
      tr = document.createElement("tr");
      tr.classList.add("row");
      td.classList.add("hour");
      td.textContent = hour;
      last_hour = hour;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("busItemRow");
    }
    busItem = document.createElement("div");
    shortName_div = document.createElement("div");
    shortName = document.createElement("span");
    dest_div = document.createElement("div");
    dest = document.createElement("span");
    timeEl_div = document.createElement("div");
    timeEl = document.createElement("span");

    shortName.textContent = route_short_name;
    timeEl.textContent = minute;
    destList = via_stop.split(", ");

    destList.sort((a, b) => {
      return sorting_key.indexOf(a) - sorting_key.indexOf(b);
    });
    destList = [...destList, ...[destination_stop]];
    destText = "";
    for (stopName of destList) {
      if (stopName == "") {
        continue;
      }
      if (stopName == "横川駅前") {
        busItem.classList.add("viaYokogawa");
      } else if (stopName == "中広町") {
        busItem.classList.add("viaNakahiro");
      } else if (stopName == "広島港桟橋") {
        busItem.classList.add("MinatoLine");
      } else if (stopName == "五日市駅北口") {
        busItem.classList.add("viaIshiuchi");
      }
      if (destText != "" && stopName == destList[destList.length - 1]) {
        destText += "･";
      }
      destText += dest_map.get(stopName);
    }
    dest.textContent = destText;
    shortName_div.classList.add("routeNum");
    shortName_div.appendChild(shortName);
    timeEl_div.classList.add("departTime");
    timeEl_div.appendChild(timeEl);
    dest_div.classList.add("dest");
    dest_div.appendChild(dest);
    busItem.classList.add("busItem");
    busItem.appendChild(shortName_div);
    busItem.appendChild(timeEl_div);
    busItem.appendChild(dest_div);
    td.appendChild(busItem);

    tr.appendChild(td);
  }
  // document.getElementById("data").innerHTML = JSON.stringify(
  //   univ_data[0],
  //   null,
  //   2,
  // );
}

fetchAndDisplayData("ichidai");
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("stopName");
  console.log(select);
  select.addEventListener('change', (event) => {
    // event.target は select 要素自身を指します
    const text = event.target.options[event.target.selectedIndex].text;
    
    if (text == "市立大学前") {
      fetchAndDisplayData("ichidai")
    }else {
      fetchAndDisplayData("numata")
    }
  });
});


