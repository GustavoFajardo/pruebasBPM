import React from 'react'

export const NoInfo: React.FC = () => {
    return (
        <div className="mt-5 d-flex justify-content-center align-items-center aling-column">
            <img className="img-fluid" src={process.env.PUBLIC_URL + "/assets/No-info.png"} height={350} width={350} alt="No hay infomación para mostrar" />
            <h1>No existe información</h1>
        </div>
    )
}

