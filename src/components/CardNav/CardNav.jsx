import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import './CardNav.css';

const CardNav = ({
    logo,
    logoAlt = 'Logo',
    items,
    className = '',
    ease = 'power3.out',
    baseColor = '#1e293b',
    menuColor,
    buttonBgColor = '#66a1be',
    buttonTextColor = '#ffffff',
    platformName = 'EduConnect'
}) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);
    const navigate = useNavigate();

    // Calculates the required height for the expanded navigation bar,
    // crucial for handling auto-calculated scroll height on mobile.
    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 300;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            const contentEl = navEl.querySelector('.card-nav-content');
            if (contentEl) {
                // Save original styles to revert after measurement
                const wasPosition = contentEl.style.position;
                const wasHeight = contentEl.style.height;

                // Temporarily make content static to measure scroll height
                contentEl.style.position = 'static';
                contentEl.style.height = 'auto';

                const topBar = 70;
                const padding = 20;
                const contentHeight = contentEl.scrollHeight;

                // Revert styles
                contentEl.style.position = wasPosition;
                contentEl.style.height = wasHeight;

                return topBar + contentHeight + padding;
            }
        }
        // Desktop height (fixed)
        return 300;
    };

    // Creates the GSAP timeline for the expansion/collapse animation
    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;

        gsap.set(navEl, { height: 70, overflow: 'hidden' });
        gsap.set(cardsRef.current, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        // Step 1: Animate height expansion
        tl.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease
        });

        // Step 2: Animate cards fading up and in
        tl.to(cardsRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease,
            stagger: 0.06
        }, '-=0.1');

        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;

        return () => {
            tl?.kill();
            tlRef.current = null;
        };
    }, [ease, items]);

    // Handles resizing while the menu is open to recalculate the height
    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tlRef.current) return;

            if (isExpanded) {
                const newHeight = calculateHeight();
                // Directly set the height if expanded to handle fluid resizing
                gsap.set(navRef.current, { height: newHeight });

                // Recreate the timeline to update its height logic
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    newTl.progress(1); // Jump to the end state
                    tlRef.current = newTl;
                }
            } else {
                // If collapsed, just ensure the timeline is recreated for the next open
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    tlRef.current = newTl;
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded]);

    // Click Outside Handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isExpanded && navRef.current && !navRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    const closeMenu = () => {
        const tl = tlRef.current;
        if (tl) {
            // Always update hamburger state immediately
            setIsHamburgerOpen(false);

            if (isExpanded) {
                tl.eventCallback('onReverseComplete', () => {
                    setIsExpanded(false);
                    // Reset timeline to ensure it's ready for next open
                    tl.eventCallback('onReverseComplete', null);
                    // Force timeline back to start for clean reopen
                    tl.progress(0);
                });
                tl.reverse();
            } else {
                // If not expanded,still ensure states are reset
                setIsExpanded(false);
                tl.progress(0);
            }
        } else {
            // Fallback: reset states even without timeline
            setIsHamburgerOpen(false);
            setIsExpanded(false);
        }
    };

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;

        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            // Force restart from beginning to ensure items are visible
            tl.restart();
        } else {
            closeMenu();
        }
    };

    const handleLinkClick = (e, link) => {
        // Extract section ID from href (e.g., "#home" -> "home")
        const sectionId = link.href?.startsWith('#') ? link.href.substring(1) : null;

        // If it's an anchor link to a section, prevent default and smooth scroll
        if (sectionId) {
            e.preventDefault();
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Handle custom onClick if provided
        if (link.onClick) {
            link.onClick(e);
        }

        // ALWAYS close menu for any link click
        closeMenu();
    };

    const setCardRef = i => el => {
        if (el) cardsRef.current[i] = el;
    };

    return (
        <div className={`card-nav-container ${className}`}>
            <nav
                ref={navRef}
                className={`card-nav ${isExpanded ? 'open' : ''}`}
                style={{ backgroundColor: baseColor }}
            >
                <div className="card-nav-top">
                    <div
                        className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        role="button"
                        aria-label={isExpanded ? 'Close menu' : 'Open menu'}
                        tabIndex={0}
                        style={{ color: menuColor }}
                    >
                        <div className="hamburger-line" />
                        <div className="hamburger-line" />
                    </div>

                    <div className="logo-container">
                        <img src={logo} alt={logoAlt} className="logo" />
                        <span className="platform-name">{platformName}</span>
                    </div>

                    <button
                        type="button"
                        className="card-nav-cta-button"
                        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                        onClick={() => navigate('/login')}
                    >
                        Get Started
                    </button>
                </div>

                <div className="card-nav-content" aria-hidden={!isExpanded}>
                    {(items || []).map((item, idx) => (
                        <div
                            key={`${item.label}-${idx}`}
                            className="nav-card"
                            ref={setCardRef(idx)}
                            style={{
                                backgroundColor: item.bgColor,
                                color: item.textColor
                            }}
                        >
                            <div className="nav-card-label">{item.label}</div>
                            <div className="nav-card-links">
                                {item.links?.map((lnk, i) => (
                                    <a
                                        key={`${lnk.label}-${i}`}
                                        className="nav-card-link"
                                        href={lnk.href}
                                        aria-label={lnk.ariaLabel}
                                        onClick={(e) => handleLinkClick(e, lnk)}
                                    >
                                        <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                                        {lnk.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default CardNav;