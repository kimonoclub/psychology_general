// js/mail-sender.js

// 【重要】ここにStep 1の最後でコピーした「WebアプリURL」を貼り付けてください
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/XXXXX.../exec";

/**
 * 講義確認テストの結果をGAS経由で非同期送信する共通関数
 * @param {string} classNum - 講義回（例: 'class_08'）
 * @param {string} studentId - 学籍番号
 * @param {string} score - 得点（例: '2 / 2'）
 * @param {string} feedback - 感想・質問
 * @param {HTMLElement} submitButton - 制御対象の送信ボタン
 */
async function sendLectureResult(classNum, studentId, score, feedback, submitButton) {
    // 1. 未入力バリデーション
    if (!studentId.trim()) {
        alert("学籍番号を入力してください。");
        return;
    }

    // 2. ローディング状態のUI表示（連打・二重送信防止）
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="animate-spin inline-block mr-2">⏳</span>送信中...`;

    // 3. 送信ペイロードの作成（アドレスは含まれません）
    const payload = {
        classNum: classNum,
        studentId: studentId,
        score: score,
        feedback: feedback
    };

    try {
        // 4. Fetch APIによる非同期通信（CORS対応モード）
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain" // GASの仕様に合わせた安全なプレーンテキスト送信
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === "success") {
            // アドレスを秘匿するため、システムに記録されたニュアンスのアラートにします
            alert("回答が正常に記録されました。お疲れ様でした。");
            
            // テキストエリア等の入力をクリアしたい場合は以下を有効化
            document.getElementById("student_feedback").value = "";
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error("Transmission Error:", error);
        alert("送信に失敗しました。時間をおいて再度お試しいただくか、ネットワーク環境を確認してください。");
    } finally {
        // 5. UIを元の状態に戻す
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// グローバルスコープへ展開
window.sendSharedMail = sendLectureResult;