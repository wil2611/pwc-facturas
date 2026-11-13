 const verificarRespuesta = (response: Response, mensajeGeneral: string) => {
    if (response.ok) return;
    if (response.status === 400) {
        throw new Error("No pudimos procesar la solicitud. Revisa los datos e inténtalo nuevamente.");
    }
    if (response.status === 404) {
        throw new Error(mensajeGeneral);
    }
    if (response.status === 409) {
        throw new Error("Ya existe una factura con ese número para el proveedor seleccionado.");
    }
    if (response.status === 413) {
        throw new Error("El archivo supera el tamaño máximo permitido de 10 MB.");
    }
    if (response.status === 415) {
        throw new Error("El formato del archivo no es válido. Selecciona un PDF, JPG o PNG.");
    }
    if (response.status === 422) {
        throw new Error("No pudimos validar la información. Revisa los datos e inténtalo nuevamente.");
    }
    if (response.status === 500) {
        throw new Error("Ocurrió un error inesperado. Inténtalo nuevamente más tarde.");
    }
    if (response.status === 502) {
        throw new Error("No se pudo procesar la factura en este momento. Inténtalo nuevamente más tarde.");
    }
    if (!response.ok) {
        throw new Error(mensajeGeneral);
    }
}

 const fetchSeguro = async (url: string, opciones?: RequestInit) => {
    try {
        return await fetch(url, opciones);
    }catch{
        throw new Error("No se pudo conectar con el servidor. Inténtalo nuevamente más tarde.");
    }
};

export { verificarRespuesta, fetchSeguro };

