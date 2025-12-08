export default {
  methods: {
    /**
     * リンクナビゲーションハンドラー
     * Command+Click/Ctrl+Clickで新しいタブで開く
     * 通常のクリックはSPAナビゲーション
     */
    handleNavigation(event, path) {
      // Command+Click (Mac) または Ctrl+Click (Windows/Linux) の場合は
      // デフォルトの動作（新しいタブで開く）を許可
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      // 中クリック（マウスホイールクリック）も新しいタブで開く
      if (event.button === 1) {
        return;
      }

      // 通常のクリックの場合はSPAナビゲーション
      event.preventDefault();
      this.$router.push(this.localePath(path));
    }
  }
};
