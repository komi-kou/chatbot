// Google Gemini API用の強化版プロキシ（ナレッジベース対応）
// APIキー取得: https://aistudio.google.com/app/apikey

const https = require('https');
const fs = require('fs');
const path = require('path');

// ナレッジベースを読み込む関数
function loadKnowledgeBase() {
  const knowledgePath = path.join(__dirname, 'knowledge-base.txt');
  if (fs.existsSync(knowledgePath)) {
    return fs.readFileSync(knowledgePath, 'utf8');
  }
  return '';
}

// Few-Shot例を生成する関数
function generateFewShotExamples() {
  return `
## 会話例1
ユーザー: 広告運用の相談をしたいんですが
kou: ご相談ありがとうございます！広告運用の件、承知いたしました。

まず無料相談（60分）で現状の課題や目標をお聞きして、最適な施策をご提案させていただきますね。

火曜か木曜の14:00-18:00でご都合いかがでしょうか？
ZOOMでも対面でも対応可能です。

お気軽にご希望の日時をお知らせください。

## 会話例2
ユーザー: 料金はどのくらいかかりますか？
kou: 料金についてご質問ありがとうございます。

大きく分けて3つのプランをご用意しております。

**1. スポットコンサル**
1時間 15,000円で、具体的な課題解決をサポート

**2. 月額サポート**
月額50,000円〜で、継続的な改善提案と分析

**3. 運用代行**
広告費の20%で、運用をフルサポート

うん、どのプランが最適かは、お客様の状況によって変わってくるんですよね。
まずは無料相談で詳しくお聞きして、最適なプランをご提案させていただければと思っております。`;
}

async function callGeminiAPIEnhanced(apiKey, baseSystemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    // ナレッジベースを読み込み
    const knowledgeBase = loadKnowledgeBase();
    const fewShotExamples = generateFewShotExamples();
    
    // 強化されたシステムプロンプトを作成
    const enhancedSystemPrompt = `
${baseSystemPrompt}

# ナレッジベース情報
${knowledgeBase}

# 会話例（Few-Shot Learning）
${fewShotExamples}

重要: 上記の情報とスタイルを厳密に守って返信してください。`;

    const requestData = JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${enhancedSystemPrompt}\n\nユーザーメッセージ: ${userMessage}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', chunk => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsedData = JSON.parse(responseData);
            // レスポンス構造をチェック
            if (parsedData.candidates && 
                parsedData.candidates[0] && 
                parsedData.candidates[0].content && 
                parsedData.candidates[0].content.parts && 
                parsedData.candidates[0].content.parts[0] &&
                parsedData.candidates[0].content.parts[0].text) {
              const reply = parsedData.candidates[0].content.parts[0].text;
              resolve({ reply });
            } else {
              reject(new Error(`Gemini response format error: ${JSON.stringify(parsedData)}`));
            }
          } catch (e) {
            reject(new Error('Failed to parse Gemini response: ' + e.message));
          }
        } else {
          reject(new Error(`Gemini API error: ${responseData}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(requestData);
    req.end();
  });
}

module.exports = { 
  callGeminiAPIEnhanced,
  loadKnowledgeBase,
  generateFewShotExamples 
};