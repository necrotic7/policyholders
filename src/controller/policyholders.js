const { Router } = require('express');
const router = Router();

// API 端點：保戶查詢
router.get('/', (req, res) => {
    const { code } = req.query;

    if(!code){
        return res.status(400).json({ error: '缺少參數 code' });
    }
});


module.exports = router;