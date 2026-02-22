import React from 'react';
import './index.css';

function NotFound() {
  return (
    // flex와 justify-center를 추가해서 화면 중앙에 오도록 함
    
    <div className="not-found-container min-h-screen bg-black text-text-main flex items-center justify-center p-10 relative">
      <div className="error">
        <div className="wrap">
          <pre className="font-mono leading-relaxed">
            <code>
              <span className="text-green-400">&lt;!</span><span>???</span><span className="text-green-400">&gt;</span><br />
              <span className="text-orange-400 font-bold">&lt;너&gt;</span><br />
              <span className="text-orange-400 text-4xl">&lt;완전히&gt;</span><br />
              &nbsp;&nbsp;* &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400 text-3xl">길을</span>:<span className="text-blue-400 font-bold">멋지다!</span>;<br />
              &nbsp;&nbsp;&#125;<br />
              <span className="text-orange-400 text-4xl">&lt;잃었어&gt;</span><br />
              <span className="text-orange-400">&lt;여기&gt;</span><br />
              <br />
              <span className="text-2xl font-bold">ERROR 404!</span><br />
              <span className="text-xl">아무것도 없어!</span><br />
              <br />
              <span className="text-gray-500 italic">&lt;!--THE TOWER,<br />
              &nbsp;&nbsp;?ASCEN?TION.--&gt;</span><br />
              <span className="text-orange-400">&lt;/돌아가자&gt;</span><br />
              <span className="text-orange-400">&lt;/밖으로&gt;</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
