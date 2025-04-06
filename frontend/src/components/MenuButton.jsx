const Menu = ({ color = null }) => {
    return (
        <div style={{ color: color || '#f8f6f6' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="fill-current h-[22px] md:hidden w-5 transition-colors hover:cursor-pointer hover:text-color-muted_gold" viewBox="0 0 448 512">
                <path
                    d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
            </svg>
        </div>
    )
}

export default Menu;