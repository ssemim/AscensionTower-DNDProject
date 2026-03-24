// 카페24 업로드를 목적으로 만들어졌습니다

import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { promisify } from 'util';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const salt = 10;
const JWT_SECRET = "jwt-secret-key-password-pst"; // 필요시 변경
const VALID_ACCESS_CODE = "여기에_가입코드_입력"; // ✅ 가입 코드 여기서 변경하세요

// ───────────────────────────────────────────
// 이모지 감지 유틸
// ───────────────────────────────────────────
const hasEmoji = (str) => /\p{Emoji_Presentation}/u.test(str);

// ───────────────────────────────────────────
// Express 설정
// ───────────────────────────────────────────
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"], // React + Vite
    methods: ["POST", "GET", "PUT"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.static('public')); // public/uploads/ 이미지 서빙

// ───────────────────────────────────────────
// multer 설정 (프로필 이미지 업로드)
// ───────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/profiles';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `profile_${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
});

// ───────────────────────────────────────────
// DB 연결
// ───────────────────────────────────────────
const db = mysql.createConnection({
    host: 'ascensiontower.cafe24app.com',
    user: 'ascenstiontower',
    password: 'ssemim36!!',
    database: 'ascensiontower',
    port: '3306' // 카페24는 3306으로 고정
});

const query = promisify(db.query).bind(db);
const beginTransaction = promisify(db.beginTransaction).bind(db);
const commit = promisify(db.commit).bind(db);
const rollback = promisify(db.rollback).bind(db);

// ───────────────────────────────────────────
// JWT 인증 미들웨어
// ───────────────────────────────────────────
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "로그인 후 사용 가능한 페이지 입니다." });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.json({ Error: "올바르지 않은 접근입니다. QnA로 문의 주세요" });
        req.id        = decoded.id;
        req.char_name = decoded.char_name;
        req.char_age  = decoded.char_age;
        req.position  = decoded.position;
        req.image_url = decoded.image_url;
        req.point     = decoded.point;
        next();
    });
};

// ───────────────────────────────────────────
// 회원가입
// ───────────────────────────────────────────
app.post('/register', async (req, res) => {
    const { id, password, char_name, accessCode } = req.body;

    // 가입 코드 확인
    if (accessCode !== VALID_ACCESS_CODE) {
        return res.json({ Error: "가입 코드가 올바르지 않습니다." });
    }

    // 이모지 차단
    if (hasEmoji(id) || hasEmoji(char_name)) {
        return res.json({ Error: "이모지는 사용할 수 없어요." });
    }

    // 아이디 중복 체크
    try {
        const existing = await query("SELECT id FROM member WHERE id = ?", [id]);
        if (existing.length > 0) {
            return res.json({ Error: "이미 사용중인 아이디입니다." });
        }
    } catch (err) {
        return res.json({ Error: "서버 오류가 발생했습니다." });
    }

    // 비밀번호 해싱 후 저장
    bcrypt.hash(password.toString(), salt, async (err, hash) => {
        if (err) return res.json({ Error: "비밀번호 해싱에 에러가 발생했습니다." });

        try {
            const sql = "INSERT INTO member (id, password, char_name, char_age) VALUES (?, ?, ?, ?)";
            await query(sql, [id, hash, char_name, 0]); // char_age 기본값 0
            return res.json({ Status: "Success" });
        } catch (err) {
            return res.json({ Error: "서버에 데이터 전송 실패" });
        }
    });
});

// ───────────────────────────────────────────
// 로그인
// ───────────────────────────────────────────
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM member WHERE id = ?";
    db.query(sql, [req.body.id], (err, data) => {
        if (err) return res.json({ Error: "서버상에서 로그인 에러가 발생했습니다." });
        if (data.length === 0) return res.json({ Error: "아이디가 존재하지 않습니다." });

        bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
            if (err) return res.json({ Error: "패스워드 해독 에러 발생" });
            if (!response) return res.json({ Error: "비밀번호가 일치하지 않습니다." });

            const { id, char_name, char_age, position, image_url, point } = data[0];
            const token = jwt.sign(
                { id, char_name, char_age, position, image_url, point },
                JWT_SECRET,
                { expiresIn: '8h' }
            );
            res.cookie('token', token);
            return res.json({ Status: "Success" });
        });
    });
});

// ───────────────────────────────────────────
// 마이페이지 - 기본 정보 + 플레이리스트
// ───────────────────────────────────────────
app.get('/mypage', verifyUser, async (req, res) => {
    const id = req.id;
    try {
        const [memberRows, playlistRows] = await Promise.all([
            query("SELECT id, char_name, char_age, position, image_url, point FROM member WHERE id = ?", [id]),
            query(`SELECT p.track_id, p.youtube_url, p.added_by, m.char_name AS added_by_name, p.message, p.added_at
                   FROM playlist p
                   LEFT JOIN member m ON p.added_by = m.id
                   WHERE p.member_id = ? ORDER BY p.added_at ASC`, [id]),
        ]);

        if (memberRows.length === 0) return res.json({ Error: "유저 정보를 찾을 수 없습니다." });

        return res.json({
            Status: "Success",
            member: memberRows[0],
            playlist: playlistRows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Error: "서버 오류가 발생했습니다." });
    }
});

// ───────────────────────────────────────────
// 마이페이지 - 친구 목록
// ───────────────────────────────────────────
app.get('/mypage/friends', verifyUser, async (req, res) => {
    try {
        const rows = await query(
            `SELECT m.id, m.char_name, m.image_url, m.position
             FROM friendship f
             JOIN member m ON f.to_id = m.id
             WHERE f.from_id = ?
             ORDER BY f.created_at DESC`,
            [req.id]
        );
        return res.json({ Status: "Success", friends: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Error: "서버 오류가 발생했습니다." });
    }
});

// ───────────────────────────────────────────
// 마이페이지 - 인벤토리
// ───────────────────────────────────────────
app.get('/mypage/inventory', verifyUser, async (req, res) => {
    try {
        const rows = await query(
            `SELECT i.inv_id, i.quantity, s.item_id, s.item_name, s.description, s.price
             FROM inventory i
             JOIN shop_item s ON i.item_id = s.item_id
             WHERE i.member_id = ?`,
            [req.id]
        );
        return res.json({ Status: "Success", inventory: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Error: "서버 오류가 발생했습니다." });
    }
});

// ───────────────────────────────────────────
// 마이페이지 - 우편함 (미수령만)
// ───────────────────────────────────────────
app.get('/mypage/mailbox', verifyUser, async (req, res) => {
    try {
        const rows = await query(
            `SELECT ml.mail_id, ml.sender_id, m.char_name AS sender_name, ml.quantity, ml.message, ml.created_at,
                    ml.item_received, s.item_id, s.item_name, s.description
             FROM mailbox ml
             LEFT JOIN member m ON ml.sender_id = m.id
             LEFT JOIN shop_item s ON ml.item_id = s.item_id
             WHERE ml.receiver_id = ? AND (ml.item_received = 0 OR ml.message IS NOT NULL)
             ORDER BY ml.created_at DESC`,
            [req.id]
        );
        return res.json({ Status: "Success", mailbox: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Error: "서버 오류가 발생했습니다." });
    }
});

// ───────────────────────────────────────────
// 마이페이지 - 우편 수령
// ───────────────────────────────────────────
app.post('/mypage/mailbox/receive', verifyUser, async (req, res) => {
    const { mail_id } = req.body;
    const member_id = req.id;

    try {
        await beginTransaction();

        // 해당 메일 조회 (본인 것인지 + 미수령인지 확인)
        const mails = await query(
            "SELECT * FROM mailbox WHERE mail_id = ? AND receiver_id = ? AND is_received = 0",
            [mail_id, member_id]
        );
        if (mails.length === 0) {
            await rollback();
            return res.json({ Error: "유효하지 않은 메일입니다." });
        }

        const mail = mails[0];

        // 아이템이 있는 경우 인벤토리에 추가 (이미 있으면 수량 증가)
        if (mail.item_id) {
            const existing = await query(
                "SELECT inv_id, quantity FROM inventory WHERE member_id = ? AND item_id = ?",
                [member_id, mail.item_id]
            );
            if (existing.length > 0) {
                await query(
                    "UPDATE inventory SET quantity = quantity + ? WHERE inv_id = ?",
                    [mail.quantity, existing[0].inv_id]
                );
            } else {
                await query(
                    "INSERT INTO inventory (member_id, item_id, quantity) VALUES (?, ?, ?)",
                    [member_id, mail.item_id, mail.quantity]
                );
            }
        }

        // 아이템 수령 처리 - item_received = 1, 메시지 없으면 is_received도 1
        await query(
            "UPDATE mailbox SET item_received = 1, is_received = ? WHERE mail_id = ?",
            [mail.message ? 0 : 1, mail_id]
        );

        await commit();
        return res.json({ Status: "Success" });
    } catch (err) {
        await rollback();
        console.error(err);
        return res.status(500).json({ Error: "수령 처리 중 오류가 발생했습니다." });
    }
});

// ───────────────────────────────────────────
// 마이페이지 - 뱃지
// ───────────────────────────────────────────
app.get('/mypage/badges', verifyUser, async (req, res) => {
    try {
        const rows = await query(
            "SELECT badge_id, earned_at FROM member_badge WHERE member_id = ? ORDER BY earned_at ASC",
            [req.id]
        );
        return res.json({ Status: "Success", badges: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Error: "서버 오류가 발생했습니다." });
    }
});

// ───────────────────────────────────────────
// 프로필 이미지 업로드
// ───────────────────────────────────────────
app.post('/mypage/upload-image', verifyUser, upload.single('image'), async (req, res) => {
    if (!req.file) return res.json({ Error: "파일이 없습니다." });

    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    try {
        // 기존 이미지 파일 삭제
        const existing = await query("SELECT image_url FROM member WHERE id = ?", [req.id]);
        if (existing[0]?.image_url) {
            const oldPath = `public${existing[0].image_url}`;
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await query("UPDATE member SET image_url = ? WHERE id = ?", [imageUrl, req.id]);
        return res.json({ Status: "Success", image_url: imageUrl });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ Error: "이미지 저장 실패" });
    }
});

// ───────────────────────────────────────────
// 로그아웃
// ───────────────────────────────────────────
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});


// ───────────────────────────────────────────
// 서버 실행
// ───────────────────────────────────────────
app.listen(8081, () => {
    console.log("Running at...")
});