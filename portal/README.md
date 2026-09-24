# HKATA 報名系統（React）

學校報名表 + 秘書處後台（`/adminportal`）。

現有 GitHub Pages 靜態網站（`index.html`、`apply.html` 等）保持喺 repo 根目錄，呢個資料夾係新嘅報名 API 同管理後台。

## 功能

- 公開報名表（對應原 `apply.html` 欄位）
- 提交後寫入資料庫，帶狀態
- 秘書處後台：搜尋、篩選、狀態管理、Excel 匯出
- 後台入口：`/adminportal`（公開網站冇連結）

## 保安

正式上線請設定管理員電郵白名單：

```
ADMIN_EMAIL_ALLOWLIST=secretariat@example.com
```

未設定時，第一個成功登入嘅帳號會成為管理員（只適合預覽）。
