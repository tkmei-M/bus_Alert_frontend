const client = window.supabaseClient;
const before_regex = /あと-\d+分/;
const yokogawa_regex = /横川駅前.*/;
const nakahiro_regex = /.*中広町.*/;
const minato_regex = /西風みなとライン/;
const ishiuchi_regex = /.*五日市駅北口.*/;

// データ取得関数
async function fetchAndDisplayData() {
  const session = await requireAuth();

  if (!session) {
    // console.log("Authorization Error. To login page.");
    window.location.href = "login.html";
    return; // 認証されていない場合は処理を中断
  }
  // 最新のバス時刻のデータをSupabaseから取得
  const { data: univ_data, error: error_u } = await client
    .from("ichi_updates")
    .select("*")
    .order("time", { ascending: true });

  if (error_u) {
    // console.error("データ取得エラー:", error_u);
    document.getElementById("data").innerHTML =
      "<p>データの取得に失敗しました</p>";
    return;
  }

  // document.getElementById("univ_data").innerHTML = `<p>データを取得しました</p>`;

  const { data: numa_data, error: error_n } = await client
    .from("numa_updates")
    .select("*")
    .order("time", { ascending: true });

  if (error_n) {
    // console.error("データ取得エラー:", error_n);
    document.getElementById("data").innerHTML =
      "<p>データの取得に失敗しました</p>";
    return;
  }
  const todayStr = new Date().toISOString().split("T")[0];
  let arrive_time = "";
  let origin_timestamp = "";
  let origin_date = "";
  let hours;
  let minutes;
  let origin_str;

  let trip_id,
    time,
    route_short_name,
    route_long_name,
    source_stop,
    destination_stop,
    via_stop,
    delay,
    now_locale,
    remaining_minutes;

  let addingCell_numa = "";
  let via_class_name = "";
  let delay_class_name = "";

  for (numa_bus of numa_data) {
    delay_class_name = "";
    origin_str = "";
    trip_id = numa_bus.trip_id;
    time = numa_bus.time;
    route_short_name = numa_bus.route_short_name;
    route_long_name = numa_bus.route_long_name;
    source_stop = numa_bus.source_stop;
    destination_stop = numa_bus.destination_stop;
    via_stop = numa_bus.via_stop;
    delay_number = numa_bus.delay;
    delay = delay_number > 0 && delay_number ? `${delay_number}分遅れ` : "";
    now_locale =
      numa_bus.now_locale == "発車待ち"
        ? numa_bus.now_locale
        : `${numa_bus.now_locale}を通過`;
    remaining_minutes = numa_bus.remaining_minutes;

    if (delay_number > 0) {
      arrive_time = new Date(`${todayStr}T${time}`);

      origin_timestamp = arrive_time.getTime() - delay_number * 60000;
      origin_date = new Date(origin_timestamp);

      hours = String(origin_date.getHours()).padStart(2, "0");
      minutes = String(origin_date.getMinutes()).padStart(2, "0");
      origin_str = `${hours}:${minutes}`;
      delay_class_name = "Delayed";
    } else {
      origin_str = time;
      delay_class_name = "";
    }

    via_stop = via_stop
      .replace(/ジ.*アウトレット.*広島/, "ｱｳﾄﾚｯﾄ")
      .replace(/アルパーク/, "ｱﾙﾊﾟ")
      .replace(/市立大学前/, "市大前")
      .replace(/広島修道大学キャンパス/, "修大ｷ")
      .replace(/免許センター/, "免許ｾﾝﾀｰ");

    if (before_regex.test(remaining_minutes)) {
      continue;
    }
    if (yokogawa_regex.test(via_stop)) {
      via_class_name = "viaYokogawa";
    } else if (nakahiro_regex.test(via_stop)) {
      via_class_name = "viaNakahiro";
    } else if (minato_regex.test(route_long_name)) {
      via_class_name = "MinatoLine";
    } else if (ishiuchi_regex.test(route_long_name)) {
      via_class_name = "Ishiuchi";
    }

    addingCell_numa += `<div class="NextBusesListCell">
<div class="BusArrivalBlock">
<div class="BusRouteAndDest ${via_class_name}_dest">
<p class="BusNum">${route_short_name}</p>
<p class="BusDest">${destination_stop}</p>
</div>
<div class="BusDelayBlock">
<div class="TimeBlock">
<p class="ArrivalTime${delay_class_name}">${origin_str}</p>
<p class="DelayHighlight${delay_class_name}">${time}</p>
</div>
<p class="DelayMinutes">${delay}</p>
</div>
</div>
<div class="ViaAndRemainingMinutesBlock">
<p class = "ViaStop ${via_class_name}">${via_stop}経由</p>
<p class="RemainingMinutes">${remaining_minutes}</p>
</div>
<p class="NowLocale">${now_locale}</p>
</div>`;
  }
  let = addingCell_ichi = "";
  for (ichi_bus of univ_data) {
    trip_id = ichi_bus.trip_id;
    time = ichi_bus.time;
    route_short_name = ichi_bus.route_short_name;
    route_long_name = ichi_bus.route_long_name;
    source_stop = ichi_bus.source_stop;
    destination_stop = ichi_bus.destination_stop;
    via_stop = ichi_bus.via_stop;
    delay_number = ichi_bus.delay;
    delay = delay_number > 0 && delay_number ? `${delay_number}分遅れ` : "";
    now_locale =
      ichi_bus.now_locale == "発車待ち"
        ? ichi_bus.now_locale
        : `${ichi_bus.now_locale}を通過`;
    remaining_minutes = ichi_bus.remaining_minutes;

    if (delay_number > 0) {
      arrive_time = new Date(`${todayStr}T${time}`);

      origin_timestamp = arrive_time.getTime() - delay_number * 60000;
      origin_date = new Date(origin_timestamp);

      hours = String(origin_date.getHours()).padStart(2, "0");
      minutes = String(origin_date.getMinutes()).padStart(2, "0");
      origin_str = `${hours}:${minutes}`;
      delay_class_name = "Delayed";
    } else {
      origin_str = time;
      delay_class_name = "";
    }

    via_stop = via_stop
      .replace(/ジ.*アウトレット.*広島/, "ｱｳﾄﾚｯﾄ")
      .replace(/アルパーク/, "ｱﾙﾊﾟ")
      .replace(/市立大学前/, "市大前")
      .replace(/広島修道大学キャンパス/, "修大ｷ")
      .replace(/免許センター/, "免許ｾﾝﾀｰ");

    if (before_regex.test(remaining_minutes)) {
      continue;
    }
    if (yokogawa_regex.test(via_stop)) {
      via_class_name = "viaYokogawa";
    } else if (nakahiro_regex.test(via_stop)) {
      via_class_name = "viaNakahiro";
    } else if (minato_regex.test(route_long_name)) {
      via_class_name = "MinatoLine";
    } else if (ishiuchi_regex.test(route_long_name)) {
      via_class_name = "Ishiuchi";
    }

    addingCell_ichi += `<div class="NextBusesListCell">
<div class="BusArrivalBlock">
<div class="BusRouteAndDest ${via_class_name}_dest">
<p class="BusNum">${route_short_name}</p>
<p class="BusDest">${destination_stop}</p>
</div>
<div class="BusDelayBlock">
<div class="TimeBlock">
<p class="ArrivalTime${delay_class_name}">${origin_str}</p>
<p class="DelayHighlight${delay_class_name}">${time}</p>
</div>
<p class="DelayMinutes">${delay}</p>
</div>
</div>
<div class="ViaAndRemainingMinutesBlock">
<p class = "ViaStop ${via_class_name}">${via_stop}経由</p>
<p class="RemainingMinutes">${remaining_minutes}</p>
</div>
<p class="NowLocale">${now_locale}</p>
</div>`;
  }
  document.getElementById("BusesCell_univ").innerHTML = addingCell_ichi;
  document.getElementById("BusesCell_numa").innerHTML = addingCell_numa;
}
// ページ読み込み時にデータを取得
document.addEventListener("DOMContentLoaded", fetchAndDisplayData);
