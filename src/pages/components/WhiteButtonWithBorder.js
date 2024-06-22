export function WhiteButtonWithBorder(props) {
    return (
        <div className={"group block"}>
            <button
                data-tooltip-target="tooltip-click"
                data-tooltip-trigger="click"
                onClick={props.action}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden font-medium rounded-lg border-2 group bg-gradient-to-br from-main-or to-main-orlll group-hover:bg-opacity-80 group-hover:from-main-orlll group-hover:to-main-or">
            <span
                className="font-bold text-lg w-20 md:w-44 relative px-5 py-2.5 transition-all ease-in duration-75 text-white rounded-md group-hover:bg-opacity-80 hover:text-main-or">
                                                            {props.name}
                                                        </span>
            </button>
            {props.action ? (
                <></>
            ):(
                <span
                    className="text-main-or absolute z-10 inline-block -mx-20 -my-5 px-2 py-2 rounded-lg bg-white pointer-events-none opacity-0 transition-opacity group-hover:opacity-50"
                >
      Coming Soon!
    </span>
            )}
        </div>
    )
}
