import React from 'react';
import './index.css';

function NotFound() {
  return (
    // flex와 justify-center를 추가해서 화면 중앙에 오도록 함
    
    <div className="not-found-container min-h-screen bg-black text-text-main flex items-center justify-center p-10 relative">
      <div className="error">
        <p className="text-4xl font-bold text-purple-500 mb-4">ERROR 404!</p>
        <div className="wrap">
          <pre className="font-mono leading-relaxed">
            <code>
              <br />
              <span className="text-2xl font-bold">ERROR 404!</span><br />
              <span className="text-xl">아무것도 없어!</span><br />
              <br />
              <span className="text-gray-500 italic">&lt;!--THE TOWER,<br />
              &nbsp;&nbsp;?ASCEN?TION.--&gt;</span><br />
              <span className="text-2xl text-purple-500 font-bold">접근 제한 구역입니다. 놀라셨나요?</span><br />
              <span className="text-lg text-gray-400">이곳은 존재하지 않는 페이지입니다.</span><br />
                <span className="text-2xl text-purple-400 font-bold">그냥 왼쪽 구석을 한 번 눌러보세요 </span><br />
                <span className="text-lg text-purple-700 font-bold">메뉴 버튼이 있던 자리 말이에요.</span><br />
                <span className="text-xl text-purple-400 font-bold">바깥으로 바로 보내드리겠습니다. </span><br />
                
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
