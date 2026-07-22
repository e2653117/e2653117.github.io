// ========================================
// じゃんけんクエスト
// ========================================

// プレイヤーのHP
let playerHP = 200;

// 現在の敵の番号
let enemyIndex = 0;

// プレイヤーの連勝数
let winStreak = 0;

// 次の攻撃が会心になるか
let guaranteedCritical = false;

// 魔王が第二形態になったか
let demonLordSecondForm = false;


// ========================================
// 敵のデータ
// ========================================

const enemies = [
    {
        name: "スライム",
        hp: 40,
        attack: 10,
        image: "👾"
    },
    {
        name: "ゴブリン",
        hp: 60,
        attack: 15,
        image: "👹"
    },
    {
        name: "オーク",
        hp: 80,
        attack: 20,
        image: "👺"
    },
    {
        name: "魔王",
        hp: 150,
        attack: 25,
        image: "😈"
    }
];


// 現在の敵のHP
let enemyHP = enemies[enemyIndex].hp;


// ========================================
// ゲーム開始
// ========================================

showEnemy();


// ========================================
// 敵を画面に表示する
// ========================================

function showEnemy() {

    const enemy = enemies[enemyIndex];

    document.getElementById("enemy-name").textContent =
        enemy.name;

    document.getElementById("enemy-hp").textContent =
        enemyHP;

    document.getElementById("enemy-image").textContent =
        enemy.image;
}


// ========================================
// じゃんけん
// ========================================

function playGame(playerHand) {

    // じゃんけんの手
    const hands = [
        "グー",
        "チョキ",
        "パー"
    ];


    // 敵の手をランダムに決める
    const random =
        Math.floor(Math.random() * 3);

    const enemyHand =
        hands[random];


    // プレイヤーと敵の手を表示
    document.getElementById("player-hand").textContent =
        playerHand;

    document.getElementById("enemy-hand").textContent =
        enemyHand;


    // ========================================
    // あいこ
    // ========================================

    if (playerHand === enemyHand) {

        document.getElementById("message").textContent =
            "🤝 あいこ！もう一度！";

        return;
    }


    // ========================================
    // プレイヤーの勝ち
    // ========================================

    if (
        (playerHand === "グー" &&
            enemyHand === "チョキ") ||

        (playerHand === "チョキ" &&
            enemyHand === "パー") ||

        (playerHand === "パー" &&
            enemyHand === "グー")
    ) {

        // 連勝数を増やす
        winStreak++;


        // 通常ダメージ
        let damage = 20;

        let message =
            "🎉 勝ち！";


        // ========================================
        // 連勝ボーナス
        // ========================================

        if (winStreak >= 2) {

            damage += 10;

            message +=
                "🔥 " +
                winStreak +
                "連勝ボーナス！";

        }


        // 3連勝で次の攻撃が会心確定
        if (winStreak === 3) {

            guaranteedCritical = true;

            message +=
                " 💥 次の攻撃は会心確定！";

        }


        // ========================================
        // 会心判定
        // ========================================

        let isCritical = false;


        // 3連勝ボーナスによる会心
        if (guaranteedCritical) {

            isCritical = true;

            guaranteedCritical = false;

        }

        // 通常の20%会心
        else if (Math.random() < 0.2) {

            isCritical = true;

        }


        // ========================================
        // 会心ダメージ
        // ========================================

        if (isCritical) {

            damage = 40;

            document.getElementById("message").textContent =
                message +
                " 💥 会心！40ダメージ！";

        }

        else {

            document.getElementById("message").textContent =
                message +
                " 敵に" +
                damage +
                "ダメージ！";

        }


        // 敵の特殊能力でダメージを変更
        const finalDamage = enemySpecialAbility(damage);

        // 実際に与えるダメージを敵のHPから減らす
        enemyHP -= finalDamage;

    }


    // ========================================
    // プレイヤーの負け
    // ========================================

    else {

        // 連勝数をリセット
        winStreak = 0;

        // 会心確定をリセット
        guaranteedCritical = false;


        // 敵の攻撃力
        let damage =
            enemies[enemyIndex].attack;


        // ========================================
        // オークの特殊能力
        // ========================================

        if (
            enemies[enemyIndex].name === "オーク" &&
            enemyHP <= enemies[enemyIndex].hp / 2
        ) {

            damage += 10;

            document.getElementById("message").textContent =
                "👺 オークが怒っている！" +
                "攻撃力アップ！";

        }


        // ========================================
        // 魔王第二形態
        // ========================================

        if (
            enemies[enemyIndex].name === "魔王" &&
            demonLordSecondForm
        ) {

            // 20～50のランダムダメージ
            damage =
                Math.floor(Math.random() * 31) + 20;


            document.getElementById("message").textContent =
                "👿 魔王・第二形態の攻撃！" +
                damage +
                "ダメージ！";

        }


        // プレイヤーのHPを減らす
        playerHP -= damage;


        // 通常のメッセージ
        if (
            enemies[enemyIndex].name !== "オーク" &&
            !demonLordSecondForm
        ) {

            document.getElementById("message").textContent =
                "😱 負け！" +
                damage +
                "ダメージ受けた！";

        }

    }


    // ========================================
    // HPを更新
    // ========================================

    updateHP();


    // ========================================
    // プレイヤーが負けた場合
    // ========================================

    if (playerHP <= 0) {

        playerHP = 0;

        updateHP();

        document.getElementById("message").textContent =
            "💀 ゲームオーバー！";

        disableButtons();

        document.getElementById("restart-button").style.display =
            "inline-block";

        return;
    }


    // ========================================
    // 魔王の第二形態チェック
    // ========================================

    if (
        enemies[enemyIndex].name === "魔王" &&
        enemyHP <= 75 &&
        !demonLordSecondForm
    ) {

        // 第二形態にする
        demonLordSecondForm = true;


        // ========================================
        // 魔王のHPを100まで回復
        // ========================================

        enemyHP = 100;


        // 見た目を変更
        document.getElementById("enemy-name").textContent =
            "魔王・第二形態";

        document.getElementById("enemy-image").textContent =
            "👿";


        // メッセージ
        document.getElementById("message").textContent =
            "😈 フフフ……ここからが本当の戦いだ……！" +
            " 魔王のHPが100まで回復した！";


        // HP表示を更新
        updateHP();

    }


    // ========================================
    // 敵を倒した場合
    // ========================================

    if (enemyHP <= 0) {

        // ========================================
        // HP回復
        // ========================================

        playerHP += 20;


        // HP最大値は200
        if (playerHP > 200) {

            playerHP = 200;

        }


        updateHP();


        // ========================================
        // 最後の敵か確認
        // ========================================

        if (
            enemyIndex === enemies.length - 1
        ) {

            document.getElementById("message").textContent =
                "🏆 おめでとう！" +
                "魔王を倒した！" +
                "HPが20回復した！" +
                "ゲームクリア！";

            disableButtons();

            document.getElementById("restart-button").style.display =
                "inline-block";

        }


        // ========================================
        // 次の敵へ
        // ========================================

        else {

            // 次の敵へ進む
            enemyIndex++;


            // 次の敵のHP
            enemyHP =
                enemies[enemyIndex].hp;


            // 次の敵を表示
            showEnemy();


            document.getElementById("message").textContent =
                "⚔️ 敵を倒した！" +
                "HPが20回復！" +
                "次の敵「" +
                enemies[enemyIndex].name +
                "」が現れた！";

        }

    }

}


// ========================================
// 敵の特殊能力
// ========================================

function enemySpecialAbility(damage) {

    // ========================================
    // スライム
    // 20%の確率でダメージ半減
    // ========================================

    if (enemies[enemyIndex].name === "スライム") {

        if (Math.random() < 0.2) {

            const originalDamage = damage;

            // ダメージを半分にする
            damage = Math.floor(damage / 2);

            document.getElementById("message").textContent =
                "👾 スライムがダメージを半減！" +
                originalDamage +
                " → " +
                damage +
                "ダメージ！";
        }
    }


    return damage;

}


// ========================================
// HPを画面に表示
// ========================================

function updateHP() {

    document.getElementById("player-hp").textContent =
        playerHP;

    document.getElementById("enemy-hp").textContent =
        Math.max(0, enemyHP);

}


// ========================================
// ボタンを無効にする
// ========================================

function disableButtons() {

    const buttons =
        document.querySelectorAll(
            ".hand-area button"
        );


    buttons.forEach(function(button) {

        button.disabled = true;

    });

}


// ========================================
// ゲームを最初からやり直す
// ========================================

function restartGame() {

    // プレイヤーHPをリセット
    playerHP = 200;


    // 最初の敵に戻す
    enemyIndex = 0;


    // 連勝数をリセット
    winStreak = 0;


    // 会心確定をリセット
    guaranteedCritical = false;


    // 魔王第二形態をリセット
    demonLordSecondForm = false;


    // 敵HPをリセット
    enemyHP =
        enemies[enemyIndex].hp;


    // HPを更新
    updateHP();


    // じゃんけん結果をリセット
    document.getElementById("player-hand").textContent =
        "---";

    document.getElementById("enemy-hand").textContent =
        "---";


    // 敵を表示
    showEnemy();


    // メッセージをリセット
    document.getElementById("message").textContent =
        "じゃんけんで敵を倒そう！";


    // ボタンを有効にする
    const buttons =
        document.querySelectorAll(
            ".hand-area button"
        );


    buttons.forEach(function(button) {

        button.disabled = false;

    });


    // リスタートボタンを隠す
    document.getElementById("restart-button").style.display =
        "none";

}