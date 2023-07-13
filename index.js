const { Player } = TextAliveApp;
// //https://developer.textalive.jp/packages/textalive-app-api/interfaces/ITextUnit.html#previous
// /*textaliveのやつ */
// /* クラスってのを使ってみようかと */
let speed = -35;
class sikaku{
    constructor(y, name_id) {
        // コンストラクタ関数における`this`はインスタンスを示すオブジェクト
       this.y = y;
       this.name_id = name_id;
    }
   count(){
       this.y+=speed;
       return this.y;
    }
}
class color_name{
    constructor(num, color,color_num) {
        //番号，色（日本語），色（カラーコード16進数）
       this.num = num;
       this.color = color;
       this.color_num = color_num;
   }
}

/* 画面の大きさ */
let win_width = window.innerWidth;
let yoko_num = Math.floor(win_width/100)-2;
//console.log(yoko_num);

/* 楽曲情報 */
let music_title = "楽曲タイトル";
let P_name = "ボカロPの名前";
let print_title = null;             //タイトルを表示する関数を入れる．
let num_t = 0;                      //文字の数
let title_frag = 0;                 //タイトルと，最後のフラグ

/* 説明 */
const greeting = ["文字をタップすると色が変わります。","ある特定の文字をタップすると円の色が変わります。","円のデフォルトの色は左下から選択可能です。","色が変わるとこを全部探してみてね。","※一度音楽を再生すると、止まれないのでご注意下さい"]
let exp;                    //説明文を表示させる関数を入れる
let gree = 0,ting=0;

const body = document.querySelector('html body');   //body
const title = document.querySelector('html title'); //title
const main = document.getElementById("main");
const sub = document.getElementById("sub");
const load = document.getElementById("loading");
const explane = document.getElementById("explane");
const explane_btn = document.getElementById("en_btn");
const start_btn = document.getElementById("start"); //startボタン
start_btn.firstChild.nextElementSibling.disabled = true;//startボタンの非活性
const op_menu = document.getElementById("op_menu");
const hm_menu = document.getElementById("hm_menu");
const close_btn = document.getElementById("close_btn");
const vol_size = document.getElementById("vol_size");
const mozi_mode = document.getElementById("mozi_mode");
const mode_num=[];
for (let FB = 0; FB < 3; FB++) {
    mode_num.push(document.getElementById("mode_"+FB));    
}

//浮気した回数
let uwaki = 0;
body.onblur = () => {   
    if (uwaki >= 5) {
        title.textContent = "ごめんって，帰ってきて！"
        uwaki = 0;
    }
    else title.textContent = "待って，行かないで！！" 
    uwaki++;  
/* フォーカスされている */}
body.onfocus = () => { 
    switch (uwaki) {
        case 1:
            title.textContent = "おかえり！！！";
            break;
    
        case 2:
            title.textContent = "どこいってたの？";
            break;
        case 3:
            title.textContent = "もうどこにも行かないで！！！";
            break;
        case 4:
            title.textContent = "私のこと嫌い..？";
            break;
	    case 5:
	        title.textContent = "もう知らないから";
	        break;
        default:
            title.textContent = "   ";
            break;
    }
/* フォーカスされていない */}

let c = null;

let sikaku_time = [];       //四角を作る時間
let si = 0;

let sabi = false;           //サビか否か
let upper = null;           //関数を定義
let num_freas = 0           //何フレーズ目か
let sikaku_num = 0;         //何個目の四角か
let pozi = [0,0,0];         //ポジション保管(ポジが被らないようにする)
let sikaku_ary = [];        //四角配列
let mozi_color = ["mozi0","mozi1","mozi2","mozi3","mozi4","mozi5"];

let mozimozi = null;        //文字くるくるの関数を入れるとこ
let kari = "kari_mozi";     //仮文字のid
let mozimozi_mode = 0;      //mozimoziのモード変更
let lyric_mozi=[];
function change_mozimozi(mode) {
    mozimozi_mode = mode;
    //console.log(mode_num[mode].classList);
    //console.log(mode_num[mode].classList)
    if (mode_num[mode].classList[0] == null || mode_num[mode].classList[0] == "mode_check") {
        mode_num[mode].classList.remove("mode_check");
        mode_num[mode].classList.add("mode_Oncheck");
        for (let shao = 0; shao < mode_num.length; shao++) {
            if (shao == mode) { continue; }
            mode_num[shao].classList.remove("mode_Oncheck");
            mode_num[shao].classList.add("mode_check");    
        }
    }else{
        //console.log("koko!")
        mode_num[mode].classList.remove("mode_Oncheck");
        mode_num[mode].classList.add("mode_check");
        let frag=0;
        for (let shao = 0; shao < mode_num.length; shao++) {
            if (shao == mode) { continue; }
            if (mode_num[shao].classList[0] == "mode_Oncheck") {
                break;
            }
            else{
                frag++;
            }
        }
        if(frag >= 2){ 
            mode_num[0].classList.add("mode_Oncheck");
            mozimozi_mode = 0;
        }
    }
    //console.log(mozimozi_mode);
}
/*  */

/* 〇の追加 */
let new_maru = document.createElement("div");
new_maru.classList.add("maru");
let new_maru_2 = document.createElement("div");//説明の時に使う〇
new_maru_2.classList.add("maru_set");
let uk = 0;     //文字くるくるのカウント
let maru_color = ["#b8b8b8" ,"#00009B"  ,"#00AE63"  ,"#CD7300"  ,"#CDCD00"  ,"#E1A2AD"  ,"#CD0000"];     //まるの色（カラーコード）
let maru_Ja_color = ["灰"   ,"青"       ,"緑"       ,"橙"       ,"黄"       ,"桃"       ,"赤"];   //丸の色
let maru_data = [];
/* 特定の文字で色変えるやつ */
const maru_SP_color_name = [  ['涙','空','雨'],['青','僕','海'],['雪'],['初','音','み','く','ミ','ク'],
                        ['光','照','鏡','雷','れ','り','ん'],['愛','心','巡','る','か'],['円'],['。','苦']];
const maru_SP_color = ['aqua','blue','white','#00AE95','#e0e01b','pink','blueviolet','black'];

for (let nonesta = 0; nonesta < maru_color.length; nonesta++) {
    //番号，色（日本語），色（カラーコード16進数）
    maru_data.push(new color_name(nonesta,maru_Ja_color[nonesta],maru_color[nonesta]));
    //console.log(maru_data[nonesta]);
}
let color_num = 0;              //default 0

function open_menu(a) {
    //console.log("menu_open");
    if (a == 0) {
        hm_menu.classList.add("item-none");
        op_menu.classList.remove("item-none");        
    }else if (a == 1) {
        op_menu.classList.add("item-none");
        hm_menu.classList.remove("item-none");        
    }
}
function new_sikaku() {

    sikaku_ary.push(new sikaku(0,"sikaku"+sikaku_num));
    let new_square = document.createElement("div");
    let yoko = Math.floor(Math.random() * yoko_num) +1;
    if (sikaku_num >= 2) {
        /* lyric */ 
        if(sikaku_num > sikaku_time.length + 1){
            //終の時
            //console.log("new_sikaku last sikaku_num = ",sikaku_num,"sikaku_time.length= ",sikaku_time.length);
            yoko = Math.floor(yoko_num/2);
        }else{
            while (yoko == pozi[0] || yoko == pozi[1] || yoko == pozi[2]) {
                yoko = Math.floor(Math.random() * yoko_num) +1;
            }   //前と位置がかぶらないように
        }
    }else{
        /* title */
       if (pozi[2] != 0) {
            yoko = pozi[2] - 1;
       }else{
           yoko = Math.floor(yoko_num/2);
        }
   }
    pozi[0] = pozi[1];
    pozi[1] = pozi[2]
    pozi[2] = yoko;
    new_square.classList.add("square","squrare_posi"+yoko);
    new_square.setAttribute("id", sikaku_ary[sikaku_num].name_id);//idの追加
    main.appendChild(new_square); 
    sikaku_num++;
}
function up() {
   //console.log("up")
    for(i=0;i<sikaku_num;i++){ 
        if (sikaku_ary[i]  == null) {
           break;
        }
        let lyric = document.getElementById(sikaku_ary[i].name_id);
        if (sikaku_ary[i].y >= -4500) {
           lyric.style.transform="translateY("+sikaku_ary[i].count()+"px)";
       }
    }
}
function change_maru_color(obj){
    //console.log(obj.textContent+"のボタン");
    for (let sta = 0; sta < maru_data.length; sta++) {
        if (obj.textContent === maru_data[sta].color) {
           color_num = maru_data[sta].num;
           new_maru.style.color = maru_data[sta].color_num;
       }
   }
   obj.appendChild(new_maru);
}
function change_color(obj){
    //console.log(obj.textContent+"が押された");
    let obj_text = obj.textContent;

    if(obj_text === "終"){
        console.log("終わる");
        change_scene(6);
        return;
    }
    /* maruの色の変更 */
    new_maru.style.color=maru_color[color_num];
    for (let ichi = 0; ichi < maru_SP_color_name.length; ichi++) {
        for (let ni = 0; maru_SP_color_name[ichi][ni] != null; ni++) {
            if (obj_text == maru_SP_color_name[ichi][ni]) {
                new_maru.style.color = maru_SP_color[ichi];
                break;    
            }
        }
    }
    /* 文字の色変え */
    let class_num = 1;
    if(main.classList[0] == "item-none"){
        //説明の時のやつ
        class_num = 0; 
    }
    if (obj.classList[class_num] == null) {
        obj.classList.add(mozi_color[0]);
        //初回は青にする
    }else if(sabi == true){
        //sabiの時のやつ
        if (obj.classList[class_num] == "moziC") {
            obj.classList.remove(obj.classList[class_num]);
            obj.classList.add(mozi_color[mozi_color.length-1]);
        }
        else{
            for (let cad = mozi_color.length - 1 ; cad >= 0 ; cad--) {
                if (obj.classList[class_num] == mozi_color[cad]) {
                    obj.classList.remove(obj.classList[class_num]);
                    if (mozi_color[cad] == mozi_color[0]) { 
                        cad = mozi_color.length - 1;
                    }else{
                        cad--;
                    }
                    obj.classList.add(mozi_color[cad]);
                    break;
            }
        }}
    }
    else{
        for (let cad = 0; cad < mozi_color.length; cad++) {
            if (obj.classList[class_num] == mozi_color[cad]) {
                obj.classList.remove(obj.classList[class_num]);
                if (mozi_color[cad] == mozi_color[mozi_color.length-1]) { 
                    cad = 0;
                }else{
                    cad++;
                }
                obj.classList.add(mozi_color[cad]);
                break;
            }
        }
        //console.log(obj.classList);
    }
    obj.appendChild(new_maru);
}
// TextAlive Player を初期化
const player = new Player({ 
    app: { token: "Z4LYBUot8J41BZOH" },
    mediaElement : document.getElementById("media"),
    mediaBannerPosition : "bottom right"});

   player.addListener({
   // 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる

        onAppReady(app){
           //TextAlive ホストとの接続時に呼ばれる
           if(!app.songUrl){
               console.log("準備完了");

           //曲の情報の設定
           player.createFromSongUrl("https://piapro.jp/t/Vfrl/20230120182855", {
           video: {
               // 音楽地図訂正履歴: https://songle.jp/songs/2427950/history
               beatId: 4267334,
               chordId: 2405059,
               repetitiveSegmentId: 2475645,
               // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FVfrl%2F20230120182855
               lyricId: 56095,
               lyricDiffId: 9637
            },
            });
            }   
        },

//     //onSongInfoLoad(){
    onVideoReady(video){
    /* 楽曲情報が取れたら呼ばれる */
        console.log(player.video.duration);//これなに？
        //たぶん動画の長さを取得できるやつだから，これ使っていこ

        //楽曲情報を取得/
        music_title = player.data.song.name;
        P_name = player.data.song.artist.name;
                
        //四角を生み出す時間を取得
        let a = player.video.firstChar;
        while (a != null) {
           sikaku_time.push(a.startTime);
            if (a.parent.parent.next == null) {
               break;
           }
           a = a.parent.parent.next.firstChar;
        }
        //console.log(sikaku_time);
        a = player.video.firstChar;
        while (a != null) {
            lyric_mozi.push(a.text);
            if (a.next == null) break;
            a=a.next;
        }
        //console.log(lyric_mozi);
        change_scene(0);
        c = null;
    },
    onTimerReady(){
        console.log("start!!!!");
        start_btn.firstChild.nextElementSibling.disabled = false;
        start_btn.firstChild.nextElementSibling.classList.remove("mozi6");
    },
   onTimeUpdate(position){
    /* 再生位置の情報が更新されたら呼ばれる */
        if (Math.ceil(position/100) * 100 >= player.video.duration && title_frag == 3) {
            //楽曲の終わり
            title_frag++;
            change_scene(5);
        }
        if (!player.video.firstChar) {
            // 歌詞情報がなければこれで処理を終わる
            return;
        }

       if (position + 2000 > sikaku_time[si]) {
           new_sikaku();
           si++;
        }
       if (sikaku_time[0] / 3 <= position && title_frag == 0) {
           /* タイトル出し */
           title_frag = 1;
           new_sikaku();
           if (print_title == null) {
               print_title = setInterval(title_print,300,music_title); 
               //console.log(print_title);              
           }
        }

       let current = c || player.video.firstChar;
        
       if (player.findChorus(position) != null) {
            //console.log("サビダァ！！！！！！");
            if (sabi != true) {
                sabi = true;
                body.classList.add("sabi");
                close_btn.classList.add("moziC");
                vol_size.classList.add("moziC");
                op_menu.classList.remove("menuver");
                op_menu.classList.add("menuver_sabi");
                mozi_mode.classList.remove("item-none");
            }
           // id指定の取得
            let elements = document.querySelectorAll('#mozi');
            // 要素の繰り返し処理
            for (let j = 0; j < elements.length; j++) {
               if(elements.length == 0) break;
               if (elements[j].classList[1] == null) {
                elements[j].classList.add("moziC");
               }
            }/* サビへの切り替え */
            elements = document.querySelectorAll('#sabi_Change');
            for (let j = 0; j < elements.length; j++) {
                if(elements.length == 0) break;
                if (elements[j].classList[1] == null) {
                    elements[j].classList.add("moziC");
                }
             }

            if (current.next.startTime - 500 < position && current != current.parent.parent.lastChar) {
                if (mozimozi == null) {
                    mozi_change(current.next);
                    mozimozi = setInterval(mozi_change,150,current.next);
                    uk = 0;
                }     
            }
       }else{
           //console.log("サビじゃないよぉぉぉぉ！！！！！！");
            if (sabi != false) {
                sabi = false;
                //body.classList.add("normal");
                body.classList.remove("sabi");
                close_btn.classList.remove("moziC");
                vol_size.classList.remove("moziC");
                op_menu.classList.remove("menuver_sabi");
                op_menu.classList.add("menuver");
                mozi_mode.classList.add("item-none");
            }
           // id指定の取得
           let elements = document.querySelectorAll('#mozi');
           // 要素の繰り返し処理
           for (let j = 0; j < elements.length; j++) {
              if(elements.length == 0) break;
               elements[j].classList.remove("moziC");
           } 
           elements = document.querySelectorAll('#sabi_Change');
           for (let j = 0; j < elements.length; j++) {
               if(elements.length == 0) break;
                elements[j].classList.remove("moziC");
            }
       }
       while (current && current.startTime < position) {
           // 新しい文字が発声されようとしている
            if (c !== current) {
                if (print_title != null) {
                    clearInterval(print_title);
                }
                if (current.parent.parent.firstChar === current && player.video.firstChar != current) {
                    /* フレーズのはじめ　＆＆　本当に最初の文字をのぞく */
                    //console.log("num_freas = " + num_freas);
                    num_freas++;
                    //console.log("num_freas = "+num_freas);
                }else if (current.parent.parent.lastChar === current) {
                    // フレーズの最後の文字か否か
                    //console.log("lastChar : "+current);
                }
                //発声タイミング
                newLetter(current);
                //console.log("c : "+c+"position : "+current.startTime);
                //console.log("position : "+position);
                c = current;
            }
           current = current.next;
        }
        if (position > player.video.duration - 7800) {
            if (title_frag == 1) {
                console.log("終わる7.8秒前");
                new_sikaku();
                num_freas++;
                title_frag++;
            }
            
        }
        if (position > player.video.duration - 5800) {
            //終わる6秒前
            if (title_frag == 2) {
                console.log("終わる5.8秒前");
                newLetter("終");
                title_frag++;
            }
        }
    }
});
function title_print(hairetsu) {
//     console.log(num_freas);
//     //console.log(sikaku_ary[num_freas]);
    let lyric = document.getElementById(sikaku_ary[num_freas].name_id);
//     //console.log(lyric);
    if (hairetsu.length <= num_t) {
//         //console.log("hairetsu[num_t] == null");
      clearInterval(print_title);
       print_title = null;
       num_t = 0;
       num_freas++;
       if (num_freas <= 1) {
           //console.log("titlePrint    P_name");
           new_sikaku();
           print_title = setInterval(title_print,300,P_name);       
        }
       return;
    }
    let new_mozi = document.createElement("div");
    new_mozi.textContent = hairetsu[num_t];
    //console.log(hairetsu[num_t]);
    new_mozi.classList.add("mozi_title");
    new_mozi.setAttribute("id", "mozi");
    new_mozi.setAttribute('onclick','change_color(this)')
    lyric.appendChild(new_mozi);    
    num_t++;
}
function newLetter(c) {
    //console.log(c+ ": 表示！！")
   /* くるくる後始末 */
    if (document.getElementById(kari) != null) {
        document.getElementById(kari).remove();
        //console.log("文字delete");
    }
    if (mozimozi) {
        clearInterval(mozimozi);
        mozimozi=null;
    }

    //console.log("c : " + c);
    //console.log(sikaku_ary[num_freas].name_id);
    let lyric = document.getElementById(sikaku_ary[num_freas].name_id);
    //console.log(lyric);
    if (c == null) return;
    let new_mozi = document.createElement("div");
    new_mozi.textContent = c;
    if (c === "終") new_mozi.classList.add("mozi_ex");
    new_mozi.classList.add("mozi");
    new_mozi.setAttribute("id", "mozi");
    new_mozi.setAttribute('onclick', 'change_color(this)');
    if(sabi){
        new_mozi.classList.add("moziC");
    }
    lyric.appendChild(new_mozi);
}

function start() {
    if(player){
       if (!player.isPlaying) {
            player.requestMediaSeek(0);
            player.requestPlay();
            //start_btn.disabled = true;
            start_btn.classList.add("item-none");
            if(upper == null) upper = setInterval(up,500);
       }
   }
}

// /* 文字くるくる */
function mozi_change(c) {
    let kari_obj = document.getElementById(kari);
    if (kari_obj != null) {
//             //console.log(kari_obj);
        kari_obj.remove();
    }
    let lyric = document.getElementById(sikaku_ary[num_freas].name_id);
    let chi = lyric.lastChild;
//         //console.log(chi);
//         //console.log("MOZI:num_freas = "+num_freas);
    if (chi.textContent === c.text) {
        console.log("text = " + chi.textContent +"c = "+ c.text)
        console.log("return");
        return;
    }
//         //console.log("a");
    let new_mozi = document.createElement("div");
    let moziCode;       //文字コードを入れます．
    if(mozimozi_mode < 2){
        moziCode = Math.floor(Math.random()*81);
        if (mozimozi_mode == 0) {   /* 0 ランダムひらがな 12354~12435*/
            moziCode += 12354;
        }
        else{   /* 1 ランダムカタカナ 12450~12531*/
            moziCode += 12450;
        }
        new_mozi.textContent = String.fromCharCode(moziCode);
    }
    else{
        /* 2 ランダム歌詞抽出 */
        moziCode= Math.floor(Math.random()*lyric_mozi.length);
        new_mozi.textContent = lyric_mozi[moziCode];
    }
    new_mozi.classList.add("mozi");
    new_mozi.setAttribute("id", kari);
    if(sabi){
        new_mozi.classList.add("moziC");
    }
    lyric.appendChild(new_mozi);
    uk++;           //文字数のカウント
    if (uk >= 3) {  //3文字出したら終わる
        clearInterval(mozimozi);
        mozimozi = null;
    }
}

/* 本編前の段階 */
function change_scene(mode){
    switch (mode) {
       case 0:
           //menu画面への遷移
           load.classList.add("menu_sikaku");
           load.removeChild(load.children[0]);
           let btn_explan = document.createElement("button");
           btn_explan.textContent = "説明";
           btn_explan.setAttribute('onclick','change_scene(1)');
           let btn_close = document.createElement("button");
           btn_close.textContent = "本編へ";
           btn_close.setAttribute('onclick','change_scene(2)');
           load.prepend(btn_close);
           load.prepend(btn_explan);
           break;
       case 1:
           //説明画面への遷移
           load.classList.add("item-none");
           explane.classList.remove("item-none");
           explane_btn.classList.remove("item-none");
           exp = setInterval(Print_Explan,150);
           //説明を表示する関数．
            break;
       case 2:
           //main画面への遷移
            sub.classList.add("item-none");
            load.classList.add("item-none");
            main.classList.remove("item-none");
            explane_btn.classList.remove("item-none");
            let btn_toMain = document.getElementById("honpenhe");
            if (btn_toMain != null) {
                btn_toMain.remove();
            }
           break;
        case 5:
            //終わりボタンを作りたい
            console.log("終わり");
            explane.classList.add("item-none");
            sub.classList.remove("item-none");
            let fin = document.createElement("div");
            fin.classList.add("load_sikaku");
            sub.appendChild(fin);
            let fin_btn = document.createElement("input");
            fin_btn.value = "戻る"
            fin_btn.type = "button"
            fin_btn.setAttribute("onclick",'change_scene(6)');
            fin.appendChild(fin_btn);

            break;
        case 6:
            location.reload();
            break;
       default:
           break;
    }
}
function Print_Explan(){
    /* 説明のとこの説明文の表示 */
    if (gree == 0 && ting == 0) {
        for (let roboro = 0; roboro < greeting.length; roboro++) {
            let gree_sikaku = document.createElement("div");
            gree_sikaku.classList.add("ex_sikaku");
            explane.appendChild(gree_sikaku);
        }        
    }
    if (greeting[gree][ting] == null) {
        if (gree < greeting.length - 1) {
           gree++;
           ting=0;
       }else {
           clearInterval(exp);
           let next_button= document.createElement("button");
           next_button.textContent = "本編へ";
           next_button.classList.add("btn_main");
           next_button.setAttribute("id","honpenhe");
           next_button.setAttribute('onclick','change_scene(2)');
           sub.appendChild(next_button);
        }
    }
    let parent_obj = explane.children[gree];
    let gree_obj = document.createElement("span");
    gree_obj.textContent = greeting[gree][ting];
    gree_obj.setAttribute('onclick', 'change_color(this)');
    parent_obj.appendChild(gree_obj);
    ting++;
}
function change_volume(ver) {
    //console.log(ver.value);
    player.volume = ver.value;
    vol_size.textContent = ver.value;
}