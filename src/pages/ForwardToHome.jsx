import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ForwardToHOME = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('../home')
    }, []) //load
    return (<></>);
}

export default ForwardToHOME

