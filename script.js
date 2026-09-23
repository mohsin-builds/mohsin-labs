"use strict";


/* =========================================================
   MOHSIN LABS — PRODUCTION JAVASCRIPT
========================================================= */


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (
    selector,
    scope = document
) =>
    scope.querySelector(selector);


const $$ = (
    selector,
    scope = document
) =>
    [...scope.querySelectorAll(selector)];


/* =========================================================
   ENVIRONMENT
========================================================= */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


const finePointer =
    window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );


const tabletBreakpoint =
    window.matchMedia(
        "(max-width: 1050px)"
    );


/* =========================================================
   UTILITIES
========================================================= */

function clamp(
    value,
    min,
    max
) {

    return Math.min(
        Math.max(
            value,
            min
        ),
        max
    );

}


function lerp(
    current,
    target,
    factor
) {

    return current +
        (
            target - current
        ) * factor;

}


/* =========================================================
   HERO
========================================================= */

const hero =
    $(".hero");


const heroWorld =
    $(".hero-world");


const heroNebula =
    $(".hero-nebula");


const heroOrbit =
    $(".hero-orbit");


const heroContent =
    $(".hero-content");


const heroMotion = {

    targetX: 0,

    targetY: 0,

    currentX: 0,

    currentY: 0,

    time: 0,

    visible: true

};


/* =========================================================
   HERO — INTRO
========================================================= */

function runHeroIntro() {

    if (
        !heroContent
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    heroContent.animate(
        [
            {
                opacity: 0,

                transform:
                    "translateY(24px)"
            },

            {
                opacity: 1,

                transform:
                    "translateY(0)"
            }
        ],
        {
            duration:
                1050,

            easing:
                "cubic-bezier(.22,1,.36,1)",

            fill:
                "both"
        }
    );

}


/* =========================================================
   HERO — POINTER INPUT
========================================================= */

function bindHeroPointer() {

    if (
        !hero
        ||
        !finePointer.matches
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    hero.addEventListener(
        "pointermove",
        event => {

            const rect =
                hero.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                )
                /
                Math.max(
                    rect.width,
                    1
                );


            const y =
                (
                    event.clientY -
                    rect.top
                )
                /
                Math.max(
                    rect.height,
                    1
                );


            heroMotion.targetX =
                (
                    x - .5
                ) * 2;


            heroMotion.targetY =
                (
                    y - .5
                ) * 2;

        },
        {
            passive: true
        }
    );


    hero.addEventListener(
        "pointerleave",
        () => {

            heroMotion.targetX =
                0;


            heroMotion.targetY =
                0;

        }
    );

}


/* =========================================================
   HERO — SCROLL DEPTH
========================================================= */

function updateHeroScroll() {

    if (
        !hero
        ||
        !heroContent
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    const rect =
        hero.getBoundingClientRect();


    if (
        rect.bottom <= 0
        ||
        rect.top >= window.innerHeight
    ) {

        return;

    }


    const heroHeight =
        Math.max(
            hero.offsetHeight,
            1
        );


    const progress =
        clamp(
            window.scrollY /
            heroHeight,
            0,
            1
        );


    heroContent.style.transform =
        `translateY(${progress * 32}px)`;


    heroContent.style.opacity =
        String(
            1 -
            progress * .38
        );

}


/* =========================================================
   HEADER
========================================================= */

const navTrigger =
    $("#site-nav-trigger");


const mobileMenu =
    $("#mobile-menu");


const mobileMenuLinks =
    mobileMenu
        ?
        $$(
            "a",
            mobileMenu
        )
        :
        [];


let navReturnFocus =
    null;


/* =========================================================
   MOBILE MENU
========================================================= */

function openMobileMenu() {

    if (
        !mobileMenu
        ||
        !navTrigger
    ) {

        return;

    }


    closeSiteSearch(
        false
    );


    navReturnFocus =
        document.activeElement;


    mobileMenu.hidden =
        false;


    document.body.classList.add(
        "mobile-menu-open"
    );


    navTrigger.setAttribute(
        "aria-expanded",
        "true"
    );


    navTrigger.setAttribute(
        "aria-controls",
        "mobile-menu"
    );


    navTrigger.setAttribute(
        "aria-label",
        "Close navigation menu"
    );


    window.setTimeout(
        () => {

            mobileMenuLinks[0]
                ?.focus();

        },
        30
    );

}


function closeMobileMenu(
    restoreFocus = false
) {

    if (!mobileMenu) {
        return;
    }


    mobileMenu.hidden =
        true;


    document.body.classList.remove(
        "mobile-menu-open"
    );


    if (navTrigger) {

        navTrigger.setAttribute(
            "aria-expanded",
            "false"
        );


        navTrigger.setAttribute(
            "aria-label",
            tabletBreakpoint.matches
                ?
                "Open navigation menu"
                :
                "Search Mohsin Labs"
        );

    }


    if (
        restoreFocus
        &&
        navReturnFocus instanceof HTMLElement
        &&
        navReturnFocus.isConnected
    ) {

        navReturnFocus.focus();

    }


    navReturnFocus =
        null;

}


function toggleMobileMenu() {

    if (!mobileMenu) {
        return;
    }


    if (mobileMenu.hidden) {

        openMobileMenu();

    }

    else {

        closeMobileMenu(
            true
        );

    }

}


/* =========================================================
   SITE SEARCH
========================================================= */

const siteSearch =
    $("#site-search");


const siteSearchClose =
    siteSearch
        ?
        $(
            ".site-search__close",
            siteSearch
        )
        :
        null;


const siteSearchInput =
    $("#site-search-input");


const siteSearchItems =
    siteSearch
        ?
        $$(
            ".site-search__item",
            siteSearch
        )
        :
        [];


const siteSearchEmpty =
    $("#site-search-empty");


let searchReturnFocus =
    null;


/* =========================================================
   SEARCH — OPEN / CLOSE
========================================================= */

function openSiteSearch() {

    if (!siteSearch) {
        return;
    }


    closeMobileMenu(
        false
    );


    searchReturnFocus =
        document.activeElement;


    if (
        typeof siteSearch.showModal ===
        "function"
    ) {

        if (!siteSearch.open) {

            siteSearch.showModal();

        }

    }

    else {

        siteSearch.setAttribute(
            "open",
            ""
        );

    }


    navTrigger?.setAttribute(
        "aria-expanded",
        "true"
    );


    navTrigger?.setAttribute(
        "aria-controls",
        "site-search"
    );


    window.setTimeout(
        () => {

            siteSearchInput
                ?.focus();

        },
        40
    );

}


function closeSiteSearch(
    restoreFocus = true
) {

    if (!siteSearch) {
        return;
    }


    if (
        typeof siteSearch.close ===
        "function"
        &&
        siteSearch.open
    ) {

        siteSearch.close();

    }

    else {

        siteSearch.removeAttribute(
            "open"
        );

    }


    navTrigger?.setAttribute(
        "aria-expanded",
        "false"
    );


    if (
        restoreFocus
        &&
        searchReturnFocus instanceof HTMLElement
        &&
        searchReturnFocus.isConnected
    ) {

        searchReturnFocus.focus();

    }


    searchReturnFocus =
        null;

}


/* =========================================================
   SEARCH — FILTER
========================================================= */

function filterSearchResults() {

    if (!siteSearchInput) {
        return;
    }


    const query =
        siteSearchInput.value
            .trim()
            .toLowerCase();


    let visibleResults =
        0;


    siteSearchItems.forEach(
        item => {

            const text =
                (
                    item.dataset.search
                    ||
                    item.textContent
                    ||
                    ""
                )
                    .toLowerCase();


            const matches =
                !query
                ||
                text.includes(
                    query
                );


            item.hidden =
                !matches;


            if (matches) {

                visibleResults +=
                    1;

            }

        }
    );


    if (siteSearchEmpty) {

        siteSearchEmpty.hidden =
            visibleResults !== 0;

    }

}


function resetSearch() {

    if (siteSearchInput) {

        siteSearchInput.value =
            "";

    }


    filterSearchResults();

}


/* =========================================================
   HEADER TRIGGER
========================================================= */

navTrigger?.addEventListener(
    "click",
    () => {

        if (
            tabletBreakpoint.matches
        ) {

            toggleMobileMenu();

        }

        else {

            openSiteSearch();

        }

    }
);


/* =========================================================
   MOBILE MENU EVENTS
========================================================= */

mobileMenuLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                closeMobileMenu(
                    false
                );

            }
        );

    }
);


document.addEventListener(
    "pointerdown",
    event => {

        if (
            !tabletBreakpoint.matches
            ||
            !mobileMenu
            ||
            mobileMenu.hidden
            ||
            !navTrigger
        ) {

            return;

        }


        if (
            mobileMenu.contains(
                event.target
            )
            ||
            navTrigger.contains(
                event.target
            )
        ) {

            return;

        }


        closeMobileMenu(
            false
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   SEARCH EVENTS
========================================================= */

siteSearchClose?.addEventListener(
    "click",
    () => {

        closeSiteSearch();

    }
);


siteSearch?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            siteSearch
        ) {

            closeSiteSearch();

        }

    }
);


siteSearch?.addEventListener(
    "close",
    () => {

        navTrigger?.setAttribute(
            "aria-expanded",
            "false"
        );

    }
);


siteSearchInput?.addEventListener(
    "input",
    filterSearchResults
);


siteSearchItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                closeSiteSearch(
                    false
                );


                resetSearch();

            }
        );

    }
);


/* =========================================================
   HEADER MODE
========================================================= */

function syncHeaderMode() {

    closeMobileMenu(
        false
    );


    if (
        siteSearch?.open
    ) {

        closeSiteSearch(
            false
        );

    }


    if (!navTrigger) {
        return;
    }


    navTrigger.setAttribute(
        "aria-expanded",
        "false"
    );


    if (
        tabletBreakpoint.matches
    ) {

        navTrigger.setAttribute(
            "aria-controls",
            "mobile-menu"
        );


        navTrigger.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }

    else {

        navTrigger.setAttribute(
            "aria-controls",
            "site-search"
        );


        navTrigger.setAttribute(
            "aria-label",
            "Search Mohsin Labs"
        );

    }

}


if (
    typeof tabletBreakpoint
        .addEventListener ===
    "function"
) {

    tabletBreakpoint.addEventListener(
        "change",
        syncHeaderMode
    );

}


/* =========================================================
   RESEARCH
========================================================= */

const researchSection =
    $(".research-section");


const researchVisual =
    $(".research-visual__main");


const researchGlow =
    $(".research-visual__glow");


const researchCopy =
    $(".research-copy");


const researchCards =
    $$(".research-card");


const researchQuote =
    $(".research-quote");


const researchMotion = {

    targetX: 0,

    targetY: 0,

    currentX: 0,

    currentY: 0,

    time: 0,

    visible: false

};


/* =========================================================
   RESEARCH — REVEAL
========================================================= */

function setupResearchReveal() {

    if (
        !researchSection
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    const items =
        [
            researchCopy,
            ...researchCards,
            researchQuote
        ]
            .filter(
                Boolean
            );


    items.forEach(
        (
            element,
            index
        ) => {

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(28px)";


            element.style.transition =
                `
                    opacity
                    800ms
                    cubic-bezier(.22,1,.36,1)
                    ${index * 80}ms,

                    transform
                    900ms
                    cubic-bezier(.22,1,.36,1)
                    ${index * 80}ms
                `;

        }
    );


    const observer =
        new IntersectionObserver(
            entries => {

                if (
                    !entries.some(
                        entry =>
                            entry.isIntersecting
                    )
                ) {

                    return;

                }


                items.forEach(
                    element => {

                        element.style.opacity =
                            "1";


                        element.style.transform =
                            "translateY(0)";

                    }
                );


                observer.disconnect();

            },
            {
                threshold:
                    .15
            }
        );


    observer.observe(
        researchSection
    );

}


/* =========================================================
   RESEARCH — POINTER
========================================================= */

function bindResearchPointer() {

    if (
        !researchSection
        ||
        !finePointer.matches
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    researchSection.addEventListener(
        "pointermove",
        event => {

            const rect =
                researchSection
                    .getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                )
                /
                Math.max(
                    rect.width,
                    1
                );


            const y =
                (
                    event.clientY -
                    rect.top
                )
                /
                Math.max(
                    rect.height,
                    1
                );


            researchMotion.targetX =
                (
                    x - .5
                ) * 2;


            researchMotion.targetY =
                (
                    y - .5
                ) * 2;

        },
        {
            passive: true
        }
    );


    researchSection.addEventListener(
        "pointerleave",
        () => {

            researchMotion.targetX =
                0;


            researchMotion.targetY =
                0;

        }
    );

}


/* =========================================================
   RESEARCH — CARD TILT
========================================================= */

function bindResearchCards() {

    if (
        !finePointer.matches
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    researchCards.forEach(
        card => {

            card.addEventListener(
                "pointermove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        )
                        /
                        Math.max(
                            rect.width,
                            1
                        );


                    const y =
                        (
                            event.clientY -
                            rect.top
                        )
                        /
                        Math.max(
                            rect.height,
                            1
                        );


                    const rotateY =
                        (
                            x - .5
                        ) * 5;


                    const rotateX =
                        (
                            .5 - y
                        ) * 4;


                    card.style.transform =
                        `
                            perspective(900px)
                            rotateX(${rotateX}deg)
                            rotateY(${rotateY}deg)
                            translateX(4px)
                        `;

                },
                {
                    passive: true
                }
            );


            card.addEventListener(
                "pointerleave",
                () => {

                    card.style.transform =
                        `
                            perspective(900px)
                            rotateX(0deg)
                            rotateY(0deg)
                            translateX(0)
                        `;

                }
            );

        }
    );

}


/* =========================================================
   PATHWAYS
========================================================= */

const pathwaysSection =
    $(".pathways-section");


const pathwaysMotion = {

    targetX: 0,

    targetY: 0,

    currentX: 0,

    currentY: 0,

    visible: false

};


function bindPathwaysPointer() {

    if (
        !pathwaysSection
        ||
        !finePointer.matches
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    pathwaysSection.addEventListener(
        "pointermove",
        event => {

            const rect =
                pathwaysSection
                    .getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                )
                /
                Math.max(
                    rect.width,
                    1
                );


            const y =
                (
                    event.clientY -
                    rect.top
                )
                /
                Math.max(
                    rect.height,
                    1
                );


            pathwaysMotion.targetX =
                (
                    x - .5
                ) * 10;


            pathwaysMotion.targetY =
                (
                    y - .5
                ) * 7;

        },
        {
            passive: true
        }
    );


    pathwaysSection.addEventListener(
        "pointerleave",
        () => {

            pathwaysMotion.targetX =
                0;


            pathwaysMotion.targetY =
                0;

        }
    );

}


/* =========================================================
   FUTURE
========================================================= */

const futureSection =
    $(".future-section");


const futureMotion = {

    targetX: 0,

    targetY: 0,

    currentX: 0,

    currentY: 0,

    visible: false

};


function bindFuturePointer() {

    if (
        !futureSection
        ||
        !finePointer.matches
        ||
        prefersReducedMotion.matches
    ) {

        return;

    }


    futureSection.addEventListener(
        "pointermove",
        event => {

            const rect =
                futureSection
                    .getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                )
                /
                Math.max(
                    rect.width,
                    1
                );


            const y =
                (
                    event.clientY -
                    rect.top
                )
                /
                Math.max(
                    rect.height,
                    1
                );


            futureMotion.targetX =
                (
                    x - .5
                ) * 8;


            futureMotion.targetY =
                (
                    y - .5
                ) * 5;

        },
        {
            passive: true
        }
    );


    futureSection.addEventListener(
        "pointerleave",
        () => {

            futureMotion.targetX =
                0;


            futureMotion.targetY =
                0;

        }
    );

}


/* =========================================================
   SECTION VISIBILITY
========================================================= */

function observeMotionSections() {

    if (
        typeof IntersectionObserver !==
        "function"
    ) {

        heroMotion.visible =
            true;


        researchMotion.visible =
            true;


        pathwaysMotion.visible =
            true;


        futureMotion.visible =
            true;


        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        switch (
                            entry.target
                        ) {

                            case hero:

                                heroMotion.visible =
                                    entry.isIntersecting;

                                break;


                            case researchSection:

                                researchMotion.visible =
                                    entry.isIntersecting;

                                break;


                            case pathwaysSection:

                                pathwaysMotion.visible =
                                    entry.isIntersecting;

                                break;


                            case futureSection:

                                futureMotion.visible =
                                    entry.isIntersecting;

                                break;

                        }

                    }
                );

            },
            {
                rootMargin:
                    "150px 0px",

                threshold:
                    0
            }
        );


    [
        hero,
        researchSection,
        pathwaysSection,
        futureSection
    ]
        .filter(
            Boolean
        )
        .forEach(
            section => {

                observer.observe(
                    section
                );

            }
        );

}


/* =========================================================
   SHARED MOTION LOOP
========================================================= */

function animateMotion() {

    if (
        !prefersReducedMotion.matches
        &&
        finePointer.matches
        &&
        document.visibilityState ===
            "visible"
    ) {


        /* -------------------------
           Hero
        ------------------------- */

        if (
            heroMotion.visible
        ) {

            heroMotion.time +=
                .006;


            heroMotion.currentX =
                lerp(
                    heroMotion.currentX,
                    heroMotion.targetX,
                    .035
                );


            heroMotion.currentY =
                lerp(
                    heroMotion.currentY,
                    heroMotion.targetY,
                    .035
                );


            if (heroWorld) {

                const driftX =
                    heroMotion.currentX *
                    -8;


                const driftY =
                    heroMotion.currentY *
                    -5;


                const breathe =
                    Math.sin(
                        heroMotion.time
                    ) * .0025;


                heroWorld.style.transform =
                    `
                        translate3d(
                            ${driftX}px,
                            ${driftY}px,
                            0
                        )
                        scale(
                            ${1.05 + breathe}
                        )
                    `;

            }


            if (heroNebula) {

                heroNebula.style.transform =
                    `
                        translate3d(
                            ${heroMotion.currentX * -18}px,
                            ${heroMotion.currentY * -11}px,
                            0
                        )
                    `;

            }


            if (heroOrbit) {

                const rotation =
                    Math.sin(
                        heroMotion.time *
                        .7
                    ) * .65;


                const floating =
                    Math.sin(
                        heroMotion.time *
                        1.2
                    ) * 3;


                heroOrbit.style.transform =
                    `
                        translate3d(
                            ${heroMotion.currentX * 22}px,
                            ${
                                heroMotion.currentY *
                                14 +
                                floating
                            }px,
                            0
                        )
                        rotate(
                            ${rotation}deg
                        )
                    `;

            }

        }


        /* -------------------------
           Research
        ------------------------- */

        if (
            researchMotion.visible
        ) {

            researchMotion.time +=
                .006;


            researchMotion.currentX =
                lerp(
                    researchMotion.currentX,
                    researchMotion.targetX,
                    .035
                );


            researchMotion.currentY =
                lerp(
                    researchMotion.currentY,
                    researchMotion.targetY,
                    .035
                );


            if (researchVisual) {

                const breathe =
                    Math.sin(
                        researchMotion.time
                    ) * .004;


                researchVisual.style.transform =
                    `
                        translate3d(
                            ${researchMotion.currentX * -10}px,
                            ${researchMotion.currentY * -7}px,
                            0
                        )
                        scale(
                            ${1.06 + breathe}
                        )
                    `;

            }


            if (researchGlow) {

                const pulse =
                    1 +
                    Math.sin(
                        researchMotion.time *
                        1.4
                    ) * .035;


                researchGlow.style.transform =
                    `
                        translate(
                            calc(
                                -50% +
                                ${
                                    researchMotion.currentX *
                                    18
                                }px
                            ),
                            calc(
                                -50% +
                                ${
                                    researchMotion.currentY *
                                    12
                                }px
                            )
                        )
                        scale(
                            ${pulse}
                        )
                    `;

            }

        }


        /* -------------------------
           Pathways
        ------------------------- */

        if (
            pathwaysMotion.visible
            &&
            pathwaysSection
        ) {

            pathwaysMotion.currentX =
                lerp(
                    pathwaysMotion.currentX,
                    pathwaysMotion.targetX,
                    .045
                );


            pathwaysMotion.currentY =
                lerp(
                    pathwaysMotion.currentY,
                    pathwaysMotion.targetY,
                    .045
                );


            pathwaysSection.style.setProperty(
                "--pathways-x",
                `${pathwaysMotion.currentX}px`
            );


            pathwaysSection.style.setProperty(
                "--pathways-y",
                `${pathwaysMotion.currentY}px`
            );

        }


        /* -------------------------
           Future
        ------------------------- */

        if (
            futureMotion.visible
            &&
            futureSection
        ) {

            futureMotion.currentX =
                lerp(
                    futureMotion.currentX,
                    futureMotion.targetX,
                    .045
                );


            futureMotion.currentY =
                lerp(
                    futureMotion.currentY,
                    futureMotion.targetY,
                    .045
                );


            futureSection.style.setProperty(
                "--future-x",
                `${futureMotion.currentX}px`
            );


            futureSection.style.setProperty(
                "--future-y",
                `${futureMotion.currentY}px`
            );

        }

    }


    window.requestAnimationFrame(
        animateMotion
    );

}


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    $("#contact-form");


const contactFormStatus =
    $("#contact-form-status");


const contactSubmit =
    contactForm
        ?
        $(
            ".contact-submit",
            contactForm
        )
        :
        null;


const contactSubmitText =
    contactSubmit
        ?
        $(
            "span:first-child",
            contactSubmit
        )
        :
        null;


const contactSubmitArrow =
    contactSubmit
        ?
        $(
            ".contact-submit__arrow",
            contactSubmit
        )
        :
        null;


/* =========================================================
   CONTACT — STATUS
========================================================= */

function setContactStatus(
    message = "",
    type = ""
) {

    if (!contactFormStatus) {
        return;
    }


    contactFormStatus.textContent =
        message;


    contactFormStatus.classList.remove(
        "contact-form-status--success",
        "contact-form-status--error"
    );


    if (
        type ===
        "success"
    ) {

        contactFormStatus.classList.add(
            "contact-form-status--success"
        );

    }


    if (
        type ===
        "error"
    ) {

        contactFormStatus.classList.add(
            "contact-form-status--error"
        );

    }

}


/* =========================================================
   CONTACT — BUTTON STATE
========================================================= */

function setContactSubmitting(
    submitting
) {

    if (!contactSubmit) {
        return;
    }


    contactSubmit.disabled =
        submitting;


    contactSubmit.setAttribute(
        "aria-busy",
        String(
            submitting
        )
    );


    if (contactSubmitText) {

        contactSubmitText.textContent =
            submitting
                ?
                "Sending..."
                :
                "Start a Conversation";

    }


    if (contactSubmitArrow) {

        contactSubmitArrow.hidden =
            submitting;

    }

}


/* =========================================================
   CONTACT — SUBMISSION
========================================================= */

async function submitContactForm(
    event
) {

    event.preventDefault();


    if (
        !contactForm
        ||
        !contactFormStatus
    ) {

        return;

    }


    if (
        !contactForm.checkValidity()
    ) {

        contactForm.reportValidity();

        return;

    }


    setContactStatus();


    setContactSubmitting(
        true
    );


    try {

        const response =
            await fetch(
                contactForm.action,
                {
                    method:
                        "POST",

                    body:
                        new FormData(
                            contactForm
                        ),

                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            let message =
                "Submission failed";


            try {

                const payload =
                    await response.json();


                if (
                    Array.isArray(
                        payload.errors
                    )
                    &&
                    payload.errors.length
                ) {

                    message =
                        payload.errors
                            .map(
                                error =>
                                    error.message
                            )
                            .filter(
                                Boolean
                            )
                            .join(" ");

                }

            }

            catch {

                /*
                   Response body is optional.
                   The generic error message remains valid.
                */

            }


            throw new Error(
                message
            );

        }


        contactForm.reset();


        setContactStatus(
            "✓ Message sent. We’ll be in touch soon.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Mohsin Labs contact submission failed:",
            error
        );


        setContactStatus(
            "Something went wrong. Please try again or email us directly.",
            "error"
        );

    }

    finally {

        setContactSubmitting(
            false
        );

    }

}


contactForm?.addEventListener(
    "submit",
    submitContactForm
);


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    event => {


        /* -------------------------
           Quick search
        ------------------------- */

        if (
            (
                event.ctrlKey
                ||
                event.metaKey
            )
            &&
            event.key.toLowerCase() ===
                "k"
            &&
            !tabletBreakpoint.matches
        ) {

            event.preventDefault();


            openSiteSearch();

            return;

        }


        /* -------------------------
           Escape
        ------------------------- */

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            mobileMenu
            &&
            !mobileMenu.hidden
        ) {

            closeMobileMenu(
                true
            );

            return;

        }


        if (
            siteSearch
            &&
            siteSearch.open
        ) {

            event.preventDefault();


            closeSiteSearch();

        }

    }
);


/* =========================================================
   SCROLL PERFORMANCE
========================================================= */

let scrollFrame =
    0;


window.addEventListener(
    "scroll",
    () => {

        if (scrollFrame) {
            return;
        }


        scrollFrame =
            window.requestAnimationFrame(
                () => {

                    updateHeroScroll();


                    scrollFrame =
                        0;

                }
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   USER-PREFERENCE CHANGES
========================================================= */

function resetMotionStyles() {

    if (
        prefersReducedMotion.matches
    ) {

        heroWorld?.style.removeProperty(
            "transform"
        );


        heroNebula?.style.removeProperty(
            "transform"
        );


        heroOrbit?.style.removeProperty(
            "transform"
        );


        researchVisual?.style.removeProperty(
            "transform"
        );


        researchGlow?.style.removeProperty(
            "transform"
        );


        pathwaysSection?.style.setProperty(
            "--pathways-x",
            "0px"
        );


        pathwaysSection?.style.setProperty(
            "--pathways-y",
            "0px"
        );


        futureSection?.style.setProperty(
            "--future-x",
            "0px"
        );


        futureSection?.style.setProperty(
            "--future-y",
            "0px"
        );

    }

}


if (
    typeof prefersReducedMotion
        .addEventListener ===
    "function"
) {

    prefersReducedMotion.addEventListener(
        "change",
        resetMotionStyles
    );

}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeMohsinLabs() {

    syncHeaderMode();


    filterSearchResults();


    runHeroIntro();


    bindHeroPointer();


    setupResearchReveal();


    bindResearchPointer();


    bindResearchCards();


    bindPathwaysPointer();


    bindFuturePointer();


    observeMotionSections();


    updateHeroScroll();


    resetMotionStyles();


    animateMotion();

}


initializeMohsinLabs();