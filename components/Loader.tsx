export default function Loader({ show }: { show: boolean }) {
    return show ? <div className="loader" ></div> : null;
}