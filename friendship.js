
"use strict";

/* ==========================================================
   FRIENDSHIP DAY
   PART 1
   App Foundation
   ========================================================== */


/* ==========================================================
   DOM ELEMENTS
   ========================================================== */

const card = document.getElementById("card");
const stage = document.querySelector(".stage");

const surpriseForm = document.getElementById("surpriseForm");

const yourNameInput = document.getElementById("yourName");
const friendNameInput = document.getElementById("friendName");

const formError = document.getElementById("formError");

const messageContent = document.getElementById("messageContent");
const quote = document.getElementById("quote");

const generateBtn = document.getElementById("generateBtn");

const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

const nextSlideBtn = document.getElementById("nextSlideBtn");

const stickerStage = document.getElementById("stickerStage");
const stickerCard = document.getElementById("stickerCard");

const stickerBackBtn = document.getElementById("stickerBackBtn");
const stickerDownloadBtn = document.getElementById("stickerDownloadBtn");
const stickerShareBtn = document.getElementById("stickerShareBtn");
const stickerResetBtn = document.getElementById("stickerResetBtn");

const cutoutRow1 = document.getElementById("cutoutRow1");
const cutoutRow2 = document.getElementById("cutoutRow2");

const gradientBg = document.getElementById("gradientBg");
const glowLayer = document.getElementById("glowLayer");
const starsLayer = document.getElementById("starsLayer");
const floatingLayer = document.getElementById("floatingLayer");

const toast = document.getElementById("toast");

const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");


/* ==========================================================
   CONFIGURATION
   ========================================================== */

const CONFIG = Object.freeze({

    maxNameLength:30,

    floatingIcons:12,

    starCount:140,

    typingSpeed:34,

    quoteDelay:600,

    toastDuration:2200,

    sparkleCount:12,

    confettiCount:160

});


/* ==========================================================
   APP STATE
   ========================================================== */

const state={

    yourName:"",

    friendName:"",

    currentQuote:"",

    currentMessage:"",

    toastTimer:null,

    memoryTimer:null,

    typing:false,

    confetti:[],

    starsBuilt:false,

    stickerOpen:false

};


/* ==========================================================
   FRIENDSHIP QUOTES
   ========================================================== */

const QUOTES=[

"True friendship is one of life's greatest gifts.",

"A real friend makes every ordinary day extraordinary.",

"Friends make the world brighter.",

"Good friends multiply happiness.",

"Distance never weakens genuine friendship.",

"Life is better with true friends.",

"Together every memory becomes priceless.",

"Friendship is another word for family.",

"Some friends become unforgettable chapters of life.",

"Every smile becomes brighter with a best friend."

];


/* ==========================================================
   FRIENDSHIP MESSAGES
   ========================================================== */

const MESSAGES=[

"Thank you for being the reason behind countless smiles.",

"You're one of the best blessings life has ever given me.",

"No matter where life takes us, you'll always have a special place in my heart.",

"Our memories are my favourite treasure.",

"Some friendships never fade—they only grow stronger.",

"You make difficult days easier and happy days unforgettable.",

"Thank you for always believing in me.",

"Friendship like ours deserves to be celebrated every day.",

"You're not just my friend—you are my safe place.",

"I'm grateful that life introduced me to someone like you."

];


/* ==========================================================
   FLOATING EMOJIS
   ========================================================== */

const FLOATING_ICONS=[

"💙",
"✨",
"⭐",
"💛",
"🌸",
"🦋",
"🎉",
"💫",
"🌈",
"❤️",
"😊",
"🎈"

];


/* ==========================================================
   HELPERS
   ========================================================== */

function random(min,max){

    return Math.random()*(max-min)+min;

}


function randomInt(min,max){

    return Math.floor(random(min,max+1));

}


function pick(array){

    return array[randomInt(0,array.length-1)];

}


function capitalize(text){

    return text

        .trim()

        .replace(/\s+/g," ")

        .replace(/\b\w/g,c=>c.toUpperCase());

}


function sanitize(text){

    return capitalize(

        text.replace(/[<>]/g,"")

    );

}


function wait(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}


/* ==========================================================
   CANVAS
   ========================================================== */

function resizeCanvas(){

    const dpr=window.devicePixelRatio||1;

    confettiCanvas.width=window.innerWidth*dpr;

    confettiCanvas.height=window.innerHeight*dpr;

    confettiCanvas.style.width=window.innerWidth+"px";

    confettiCanvas.style.height=window.innerHeight+"px";

    ctx.setTransform(dpr,0,0,dpr,0,0);

}

resizeCanvas();


/* ==========================================================
   INITIALIZE
   ========================================================== */

function initialize(){

    formError.classList.remove("visible");

    quote.textContent="";

    messageContent.textContent="";

    resizeCanvas();

}

initialize();
/* ==========================================================
   FRIENDSHIP DAY
   PART 2
   Validation • Card Flip • Message Generation
   ========================================================== */


/* ==========================================================
   VALIDATION
   ========================================================== */

function validateForm(){

    const yourName=sanitize(yourNameInput.value);

    const friendName=sanitize(friendNameInput.value);

    if(!yourName||!friendName){

        showFormError("Please enter both names.");

        return false;

    }

    if(yourName.length<2||friendName.length<2){

        showFormError("Names must contain at least 2 letters.");

        return false;

    }

    if(!/[A-Za-z]/.test(yourName)||!/[A-Za-z]/.test(friendName)){

        showFormError("Please enter valid names.");

        return false;

    }

    hideFormError();

    state.yourName=yourName;

    state.friendName=friendName;

    return true;

}


/* ==========================================================
   ERROR
   ========================================================== */

function showFormError(message){

    formError.textContent=message;

    formError.classList.add("visible");

    card.classList.remove("shake");

    void card.offsetWidth;

    card.classList.add("shake");

}


function hideFormError(){

    formError.classList.remove("visible");

}


/* ==========================================================
   MESSAGE
   ========================================================== */

function buildMessage(){

    const intro=`Dear ${state.friendName},`;

    const body=pick(MESSAGES);

    const ending=`Happy Friendship Day! 💙
From,
${state.yourName}`;

    state.currentMessage=

`${intro}

${body}

${ending}`;

}


/* ==========================================================
   QUOTE
   ========================================================== */

function buildQuote(){

    state.currentQuote=pick(QUOTES);

}


/* ==========================================================
   TYPEWRITER
   ========================================================== */

async function typeMessage(text){

    state.typing=true;

    messageContent.innerHTML="";

    const paragraph=document.createElement("p");

    paragraph.className="message-subtitle";

    messageContent.appendChild(paragraph);

    for(let i=0;i<text.length;i++){

        paragraph.textContent+=text[i];

        await wait(CONFIG.typingSpeed);

    }

    state.typing=false;

}


/* ==========================================================
   QUOTE REVEAL
   ========================================================== */

async function revealQuote(){

    await wait(CONFIG.quoteDelay);

    quote.textContent=`"${state.currentQuote}"`;

    quote.classList.add("show");

}


/* ==========================================================
   CARD FLIP
   ========================================================== */

function flipCard(){

    card.classList.add("flipped");

}


/* ==========================================================
   DAY TO NIGHT
   ========================================================== */

function activateNightMode(){

    document.body.classList.add("night");

    starsLayer.classList.add("visible");

}


/* ==========================================================
   GENERATE
   ========================================================== */

async function generateSurprise(){

    if(state.typing) return;

    if(!validateForm()) return;

    generateBtn.disabled=true;

    buildMessage();

    buildQuote();

    flipCard();

    activateNightMode();

    await wait(700);

    messageContent.classList.add("show");

    await typeMessage(state.currentMessage);

    await revealQuote();

    if(typeof startConfetti==="function"){

        startConfetti();

    }

    generateBtn.disabled=false;

}


/* ==========================================================
   FORM EVENT
   ========================================================== */

surpriseForm.addEventListener("submit",(event)=>{

    event.preventDefault();

    generateSurprise();

});/* ==========================================================
   FRIENDSHIP DAY
   PART 3
   Stars • Floating Icons • Sparkles • Confetti
   ========================================================== */


/* ==========================================================
   CREATE STARS
   ========================================================== */

function createStars() {

    if (state.starsBuilt) return;

    state.starsBuilt = true;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < CONFIG.starCount; i++) {

        const star = document.createElement("span");

        star.className = "star";

        const size = random(1, 3);

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${random(0, 100)}%`;
        star.style.top = `${random(0, 100)}%`;

        star.style.animationDuration = `${random(2, 5)}s`;
        star.style.animationDelay = `${random(0, 4)}s`;

        fragment.appendChild(star);

    }

    starsLayer.appendChild(fragment);

}


/* ==========================================================
   FLOATING EMOJIS
   ========================================================== */

function spawnFloatingIcon() {

    const icon = document.createElement("span");

    icon.className = "floaty";

    icon.textContent = pick(FLOATING_ICONS);

    icon.style.left = `${random(5, 95)}%`;

    icon.style.fontSize = `${random(18, 34)}px`;

    icon.style.animationDuration = `${random(10, 18)}s`;

    icon.style.setProperty("--drift", `${random(-80, 80)}px`);

    floatingLayer.appendChild(icon);

    icon.addEventListener("animationend", () => {

        icon.remove();

    });

}


function startFloatingIcons() {

    clearInterval(state.memoryTimer);

    for (let i = 0; i < CONFIG.floatingIcons; i++) {

        setTimeout(spawnFloatingIcon, i * 300);

    }

    state.memoryTimer = setInterval(

        spawnFloatingIcon,

        1800

    );

}


/* ==========================================================
   SPARKLES
   ========================================================== */

function createSparkle(x, y) {

    const sparkle = document.createElement("span");

    sparkle.className = "sparkle";

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    document.body.appendChild(sparkle);

    sparkle.addEventListener("animationend", () => {

        sparkle.remove();

    });

}


function sparkleBurst() {

    const rect = card.getBoundingClientRect();

    for (let i = 0; i < CONFIG.sparkleCount; i++) {

        createSparkle(

            rect.left + random(20, rect.width - 20),

            rect.top + random(20, rect.height - 20)

        );

    }

}


/* ==========================================================
   CONFETTI ENGINE
   ========================================================== */

const CONFETTI_COLORS = [

    "#6c63ff",
    "#ff8fb1",
    "#ffc978",
    "#8ef0ff",
    "#ffffff",
    "#8cffb8"

];


function createConfetti() {

    state.confetti.length = 0;

    for (let i = 0; i < CONFIG.confettiCount; i++) {

        state.confetti.push({

            x: random(0, window.innerWidth),

            y: random(-window.innerHeight, 0),

            width: random(4, 8),

            height: random(8, 16),

            speed: random(2, 6),

            rotation: random(0, 360),

            rotationSpeed: random(-8, 8),

            color: pick(CONFETTI_COLORS)

        });

    }

}


function drawConfetti() {

    ctx.clearRect(

        0,

        0,

        window.innerWidth,

        window.innerHeight

    );

    state.confetti.forEach(piece => {

        ctx.save();

        ctx.translate(piece.x, piece.y);

        ctx.rotate(piece.rotation * Math.PI / 180);

        ctx.fillStyle = piece.color;

        ctx.fillRect(

            -piece.width / 2,

            -piece.height / 2,

            piece.width,

            piece.height

        );

        ctx.restore();

        piece.y += piece.speed;

        piece.rotation += piece.rotationSpeed;

    });

    state.confetti = state.confetti.filter(

        piece => piece.y < window.innerHeight + 30

    );

}


/* ==========================================================
   CONFETTI LOOP
   ========================================================== */

let confettiAnimation = null;

function animateConfetti() {

    drawConfetti();

    if (state.confetti.length > 0) {

        confettiAnimation = requestAnimationFrame(

            animateConfetti

        );

    } else {

        cancelAnimationFrame(confettiAnimation);

    }

}


function startConfetti() {

    createConfetti();

    animateConfetti();

}


/* ==========================================================
   START ALL VISUAL EFFECTS
   ========================================================== */

function startVisualEffects() {

    createStars();

    startFloatingIcons();

    sparkleBurst();

    startConfetti();

}

/* ==========================================================
   FRIENDSHIP DAY
   PART 4A
   Toast • Copy • Share
   ========================================================== */


/* ==========================================================
   TOAST
   ========================================================== */

function showToast(message,type="success"){

    clearTimeout(state.toastTimer);

    toast.textContent=message;

    toast.className="toast";

    toast.classList.add(type);

    toast.classList.add("show");

    state.toastTimer=setTimeout(()=>{

        toast.classList.remove("show");

    },CONFIG.toastDuration);

}


/* ==========================================================
   COPY MESSAGE
   ========================================================== */

async function copyMessage(){

    try{

        await navigator.clipboard.writeText(

            state.currentMessage+

            "\n\n"+

            state.currentQuote

        );

        showToast(

            "Message copied successfully 💙"

        );

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to copy message",

            "error"

        );

    }

}


/* ==========================================================
   SHARE MESSAGE
   ========================================================== */

async function shareMessage(){

    const shareData={

        title:"Happy Friendship Day 💙",

        text:

        state.currentMessage+

        "\n\n"+

        `"${state.currentQuote}"`

    };

    if(

        navigator.share

    ){

        try{

            await navigator.share(

                shareData

            );

            showToast(

                "Shared successfully 🎉"

            );

        }

        catch(error){

            if(

                error.name!==

                "AbortError"

            ){

                console.error(error);

            }

        }

    }

    else{

        await copyMessage();

        showToast(

            "Sharing isn't supported. Message copied instead."

        );

    }

}


/* ==========================================================
   BUTTON EVENTS
   ========================================================== */

copyBtn.addEventListener(

    "click",

    copyMessage

);


shareBtn.addEventListener(

    "click",

    shareMessage

);


/* ==========================================================
   KEYBOARD SHORTCUTS
   ========================================================== */

document.addEventListener(

    "keydown",

    event=>{

        if(

            event.ctrlKey&&

            event.key.toLowerCase()==="c"&&

            document.activeElement===copyBtn

        ){

            event.preventDefault();

            copyMessage();

        }

    }

);
/* ==========================================================
   FRIENDSHIP DAY
   PART 4B
   Download • Reset • Cleanup
   ========================================================== */


/* ==========================================================
   DOWNLOAD CARD
   ========================================================== */

async function downloadCard(){

    if(typeof html2canvas==="undefined"){

        showToast(

            "html2canvas library not found.",

            "error"

        );

        return;

    }

    try{

        showToast("Preparing image...");

        const canvas=await html2canvas(stickerCard,{

            scale:2,

            useCORS:true,

            backgroundColor:null

        });

        const link=document.createElement("a");

        link.download=

        `Friendship-Day-${Date.now()}.png`;

        link.href=canvas.toDataURL("image/png");

        link.click();

        showToast(

            "Card downloaded successfully 📥"

        );

    }

    catch(error){

        console.error(error);

        showToast(

            "Download failed",

            "error"

        );

    }

}


/* ==========================================================
   CLEAR VISUAL EFFECTS
   ========================================================== */

function stopVisualEffects(){

    clearInterval(state.memoryTimer);

    cancelAnimationFrame(confettiAnimation);

    state.confetti.length=0;

    ctx.clearRect(

        0,

        0,

        confettiCanvas.width,

        confettiCanvas.height

    );

    floatingLayer.innerHTML="";

}


/* ==========================================================
   RESET APPLICATION
   ========================================================== */

function resetApplication(){

    stopVisualEffects();

    state.yourName="";

    state.friendName="";

    state.currentMessage="";

    state.currentQuote="";

    state.typing=false;

    state.stickerOpen=false;

    surpriseForm.reset();

    hideFormError();

    quote.classList.remove("show");

    quote.textContent="";

    messageContent.innerHTML="";

    messageContent.classList.remove("show");

    card.classList.remove(

        "flipped",

        "shake"

    );

    stickerStage.classList.remove("active");

    stage.classList.remove("hide");

    document.body.classList.remove("night");

    starsLayer.classList.remove("visible");

    generateBtn.disabled=false;

    showToast("Ready for another surprise 💙");

}


/* ==========================================================
   BUTTON EVENTS
   ========================================================== */

downloadBtn.addEventListener(

    "click",

    downloadCard

);


stickerDownloadBtn.addEventListener(

    "click",

    downloadCard

);


resetBtn.addEventListener(

    "click",

    resetApplication

);


stickerResetBtn.addEventListener(

    "click",

    resetApplication

);


/* ==========================================================
   WINDOW EVENTS
   ========================================================== */

window.addEventListener(

    "resize",

    resizeCanvas

);


window.addEventListener(

    "beforeunload",

    stopVisualEffects

);

/* ==========================================================
   FRIENDSHIP DAY
   PART 5
   Sticker Page • Navigation • Final Initialization
   ========================================================== */


/* ==========================================================
   CUTOUT LETTERS
   ========================================================== */

function createCutoutLetters(text){

    cutoutRow1.innerHTML="";
    cutoutRow2.innerHTML="";

    const clean=text
        .toUpperCase()
        .trim();

    const middle=Math.ceil(clean.length/2);

    const first=clean.slice(0,middle);

    const second=clean.slice(middle);

    buildLetters(first,cutoutRow1);

    buildLetters(second,cutoutRow2);

}


function buildLetters(text,row){

    [...text].forEach(letter=>{

        const span=document.createElement("span");

        span.className="cutout-letter";

        span.textContent=letter===" " ? "•" : letter;

        span.style.setProperty(

            "--angle",

            `${random(-10,10)}deg`

        );

        span.style.background=

            `hsl(${randomInt(0,360)},85%,94%)`;

        row.appendChild(span);

    });

}


/* ==========================================================
   OPEN STICKER PAGE
   ========================================================== */

function openStickerPage(){

    state.stickerOpen=true;

    stage.classList.add("hide");

    stickerStage.classList.add("active");

    createCutoutLetters(

        state.friendName

    );

}


/* ==========================================================
   CLOSE STICKER PAGE
   ========================================================== */

function closeStickerPage(){

    state.stickerOpen=false;

    stage.classList.remove("hide");

    stickerStage.classList.remove("active");

}


/* ==========================================================
   SHARE STICKER
   ========================================================== */

async function shareSticker(){

    if(typeof html2canvas==="undefined"){

        downloadCard();

        return;

    }

    try{

        const canvas=

        await html2canvas(

            stickerCard,

            {

                scale:2,

                backgroundColor:null,

                useCORS:true

            }

        );

        canvas.toBlob(

            async blob=>{

                if(

                    !blob

                ){

                    showToast(

                        "Unable to create image",

                        "error"

                    );

                    return;

                }

                const file=

                new File(

                    [blob],

                    "Friendship-Day.png",

                    {

                        type:"image/png"

                    }

                );

                if(

                    navigator.canShare &&

                    navigator.canShare({

                        files:[file]

                    })

                ){

                    await navigator.share({

                        files:[file],

                        title:"Happy Friendship Day 💙"

                    });

                }

                else{

                    downloadCard();

                }

            },

            "image/png"

        );

    }

    catch(error){

        console.error(error);

        showToast(

            "Sharing failed",

            "error"

        );

    }

}


/* ==========================================================
   BUTTON EVENTS
   ========================================================== */

nextSlideBtn.addEventListener(

    "click",

    openStickerPage

);


stickerBackBtn.addEventListener(

    "click",

    closeStickerPage

);


stickerShareBtn.addEventListener(

    "click",

    shareSticker

);


/* ==========================================================
   ESC KEY SUPPORT
   ========================================================== */

document.addEventListener(

    "keydown",

    event=>{

        if(

            event.key==="Escape" &&

            state.stickerOpen

        ){

            closeStickerPage();

        }

    }

);


/* ==========================================================
   STARTUP
   ========================================================== */

function startApp(){

    resizeCanvas();

    createStars();

    hideFormError();

    quote.textContent="";

    messageContent.innerHTML="";

    window.addEventListener(

        "resize",

       
