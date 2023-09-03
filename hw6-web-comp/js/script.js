class TimerView extends HTMLElement {
    constructor() {
        super();

        this.intervalId = null;
        this.endTime = 0;
        this.currentTime = 0;
        this.pausedTime = 0;

        this.attachShadow({ mode: "open" });
        this.render();
    }

    connectedCallback() {
        this.renderTimer();
        this.shadowRoot
            .querySelector("#startButton")
            .addEventListener("click", this.startTimer.bind(this));
        this.shadowRoot
            .querySelector("#pauseButton")
            .addEventListener("click", this.pauseTimer.bind(this));
        this.shadowRoot
            .querySelector("#resetButton")
            .addEventListener("click", this.resetTimer.bind(this));
        if (this.getAttribute("to-time")) {
            this.startTimer();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            background: linear-gradient(45deg, #F3EFFF, #B8B9FF);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            width: 100%;
            max-width: 400px;
            backdrop-filter: blur(10px);
          }
  
          #timer {
            font-size: 36px;
            margin-bottom: 20px;
          }
  
          button {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            margin: 5px;
            transition: background 0.3s ease;
          }
  
          button:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        </style>
        <div id="timer">00:00:00</div>
        <button id="startButton">Start</button>
        <button id="pauseButton">Pause</button>
        <button id="resetButton">Reset</button>
      `;
    }

    static get observedAttributes() {
        return ["seconds", "to-time"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "seconds") {
            this.currentTime = parseInt(newValue) * 1000;
            this.endTime = Date.now() + this.currentTime;
            this.setAttribute("initial-seconds", newValue);
        } else if (name === "to-time") {
            const now = new Date();
            const timeParts = newValue.split(":");
            if (timeParts.length === 3) {
                const targetTime = new Date();
                targetTime.setHours(parseInt(timeParts[0]));
                targetTime.setMinutes(parseInt(timeParts[1]));
                targetTime.setSeconds(parseInt(timeParts[2]));

                this.currentTime = targetTime - now;
                this.endTime = now.getTime() + this.currentTime;
                this.setAttribute("initial-to-time", newValue);
            }
        }
        this.renderTimer();
    }

    updateTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            if (this.currentTime > 0) {
                this.currentTime = Math.max(
                    this.endTime - Date.now() - this.pausedTime,
                    0
                );
                this.renderTimer();

                if (this.currentTime === 0) {
                    this.dispatchEvent(new CustomEvent("endtimer"));
                    clearInterval(this.intervalId);
                }
            }
        }, 1000);
    }

    startTimer() {
        this.dispatchEvent(new CustomEvent("starttimer"));
        if (this.currentTime > 0) {
            this.endTime = Date.now() + this.currentTime + this.pausedTime;
            this.updateTimer();
        } else if (this.getAttribute("to-time")) {
            if (this.pausedTime > 0) {
                this.currentTime = this.pausedTime;
                this.pausedTime = 0;
            } else {
                const now = new Date();
                const timeParts = this.getAttribute("to-time").split(":");
                if (timeParts.length === 3) {
                    const targetTime = new Date();
                    targetTime.setHours(parseInt(timeParts[0]));
                    targetTime.setMinutes(parseInt(timeParts[1]));
                    targetTime.setSeconds(parseInt(timeParts[2]));

                    const remainingTime = targetTime - now;
                    if (remainingTime > 0) {
                        this.currentTime = remainingTime - 1000;
                    }
                }
            }
            this.endTime = Date.now() + this.currentTime;
            this.resetTimer();
            this.updateTimer();
        } else if (this.getAttribute("seconds")) {
            this.currentTime =
                parseInt(this.getAttribute("seconds")) * 1000 - 1000;
            this.endTime = Date.now() + this.currentTime;
            this.resetTimer();
            this.updateTimer();
        }
    }

    resetTimer() {
        this.dispatchEvent(new CustomEvent("resettimer"));
        clearInterval(this.intervalId);
        this.pausedTime = 0;
        const initialSeconds = this.getAttribute("initial-seconds");
        const initialToTime = this.getAttribute("initial-to-time");
        if (initialSeconds !== null) {
            this.setAttribute("seconds", initialSeconds);
        } else if (initialToTime !== null) {
            this.setAttribute("to-time", initialToTime);
        }
        this.renderTimer();
    }

    pauseTimer() {
        this.dispatchEvent(new CustomEvent("pausetimer"));
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.pausedTime += Date.now() - this.endTime;
        }
    }

    renderTimer() {
        const hours = Math.floor(this.currentTime / 3600000);
        const minutes = Math.floor((this.currentTime % 3600000) / 60000);
        const seconds = Math.floor((this.currentTime % 60000) / 1000);

        const timerElement = this.shadowRoot.querySelector("#timer");
        timerElement.textContent = `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
}

customElements.define("timer-view", TimerView);

const timers = document.querySelectorAll("timer-view");

timers.forEach((timer) => {
    timer.addEventListener("starttimer", () => timer.startTimer());
    timer.addEventListener("pausetimer", () => timer.pauseTimer());
    timer.addEventListener("resettimer", () => timer.resetTimer());
    timer.addEventListener("endtimer", () => console.log("Timer has ended."));
});