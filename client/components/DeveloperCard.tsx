import { useEffect } from 'react';

export function DeveloperCard() {
  useEffect(() => {
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      .dev-card-main {
        display: grid;
        place-items: center;
        width: 190px;
        height: 270px;
        margin: 2rem auto;
      }

      .dev-card {
        width: 190px;
        height: 270px;
        background: #FAF1F6;
        padding: 2rem 1.5rem;
        transition: box-shadow .3s ease, transform .2s ease;
        display: flex;
        flex-direction: column;
        position: absolute;
      }

      .dev-card-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .dev-card-avatar {
        background: radial-gradient(#A8A6B6,#B3B1BF,#BDBBC7,#C5C4CE,#E2E2E7);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        transition: transform .2s ease;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dev-card-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .dev-card-avatar svg {
        padding-top: 5px;
        height: 80px;
        width: 100px;
        fill: #515F65;
      }

      .dev-card-social {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        width: 190px;
        margin-top: 10%;
        text-align: center;
      }

      .dev-card-social-icon {
        list-style: none;
        color: #515F65;
        font-size: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .dev-card-social-icon svg {
        display: block;
        height: 20px;
        width: 20px;
        fill: #515F65;
        cursor: pointer;
      }

      .dev-card-title {
        color: #1b1b1b;
        font-size: 1.5em;
        font-weight: 600;
        line-height: 2rem;
        margin-top: 5px;
      }

      .dev-card-subtitle {
        color: #7e93a0;
        font-size: 0.85em;
        white-space: nowrap;
      }

      .dev-address-icon {
        fill: #515F65;
        height: 150px;
        width: 100px;
        list-style: none;
        justify-content: space-around;
      }

      .dev-address-title {
        color: #333;
        font-size: 1.0em;
        font-weight: 600;
        list-style: none;
      }

      .dev-address {
        color: #859ba8;
        font-size: 0.8em;
        list-style: none;
        padding-left: 20px;
      }

      .dev-contact-title {
        color: #333;
        font-size: 1.5em;
        font-weight: 600;
        margin-top: 45%;
        padding-bottom: 5px;
      }

      .dev-card-contact {
        color: #859ba8;
        font-size: 0.8em;
      }

      .dev-icon-contact {
        list-style: none;
        display: flex;
        align-items: center;
      }

      .dev-icon-contact svg {
        display: block;
        height: 18px;
        width: 18px;
        fill: #515F65;
        padding-right: 5px;
      }

      .dev-card:hover {
        box-shadow: 0 10px 50px #23232333;
      }

      .dev-card:hover .dev-card-info {
        transform: translateY(-5%);
      }

      .dev-card-avatar:hover {
        transform: scale(1.1);
      }

      #dev-cs2:hover {
        transform: scale(2.0);
      }

      #dev-cs3:hover {
        transform: scale(2.0);
      }

      #dev-c1 {
        transform: translateX(0px);
        transition: transform 0.3s ease;
      }

      #dev-c2 {
        transform: translateX(0px);
        transition: transform 0.3s ease;
      }

      #dev-c3 {
        transform: translateX(0px);
        transition: transform 0.3s ease;
      }

      .dev-card-main:hover #dev-c1 {
        transform: translateX(0px);
      }

      .dev-card-main:hover #dev-c2 {
        transform: translateX(200px);
      }

      .dev-card-main:hover #dev-c3 {
        transform: translateX(-200px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="dev-card-main">
      <div id="dev-c2" className="dev-card">
        <div className="dev-card-info">
          <div className="dev-contact-title">Contact</div>
          <div className="dev-card-contact">
            <li className="dev-icon-contact">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z"></path>
              </svg>
              Tel: +91-8459597997
            </li>
            <li className="dev-icon-contact">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path>
              </svg>
              Email: sanchitnipanikar@gmail.com
            </li>
          </div>
        </div>
      </div>

      <div id="dev-c3" className="dev-card">
        <div className="dev-card-info">
          <li className="dev-address-icon">
            <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"></path>
            </svg>
          </li>
          <li className="dev-address-title">Address:</li>
          <li className="dev-address">Balewadi, Pune, Maharashtra</li>
        </div>
      </div>

      <div id="dev-c1" className="dev-card">
        <div className="dev-card-info">
          <div className="dev-card-avatar">
            <img src="/PHOTO_SANCHIT.jpeg" alt="Sanchit Nipanikar" />
          </div>
          <div className="dev-card-title">SANCHIT</div>
          <div className="dev-card-subtitle">Final year, CS, VIT Pune</div>
          <div className="dev-card-social">
            <li id="dev-cs2" className="dev-card-social-icon">
              <a href="https://www.linkedin.com/in/sanchit1606" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path>
                </svg>
                LinkedIn
              </a>
            </li>
            <li id="dev-cs3" className="dev-card-social-icon">
              <a href="https://github.com/sanchit1606" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <svg viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                </svg>
                GitHub
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

