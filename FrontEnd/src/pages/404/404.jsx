import React from 'react';
import './index.css';

function NotFound() {
  return (
    // flex와 justify-center를 추가해서 화면 중앙에 오도록 함
    
    <div className="not-found-container min-h-screen bg-main text-text-main flex items-center justify-center p-10 relative">
      <div className="error">
        <div className="wrap">
          <pre className="font-mono leading-relaxed">
            <code>
              <span className="text-green-400">&lt;!</span><span>DOCTYPE html</span><span className="text-green-400">&gt;</span><br />
              <span className="text-orange-400">&lt;html&gt;</span><br />
              <span className="text-orange-400">&lt;style&gt;</span><br />
              &nbsp;&nbsp;* &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">everything</span>:<span className="text-blue-400">awesome</span>;<br />
              &nbsp;&nbsp;&#125;<br />
              <span className="text-orange-400">&lt;/style&gt;</span><br />
              <span className="text-orange-400">&lt;body&gt;</span><br />
              <br />
              <span className="text-2xl font-bold">ERROR 404!</span><br />
              <span className="text-xl">FILE NOT FOUND!</span><br />
              <br />
              <span className="text-gray-500 italic">&lt;!--The file you are looking for,<br />
              &nbsp;&nbsp;is not where you think it is.--&gt;</span><br />
              <span className="text-orange-400">&lt;/body&gt;</span><br />
              <span className="text-orange-400">&lt;/html&gt;</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
