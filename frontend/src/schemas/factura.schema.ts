import { z } from 'zod'

const facturaSchema = z.object({
    proveedor_id: z.string().uuid('Selecciona un proveedor válido'),
    numero_factura: z.string().trim().min(1, "El número de factura es obligatorio"),
    fecha_emision: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de emisión debe tener el formato YYYY-MM-DD"),
    fecha_vencimiento: z.string().nullable().optional().refine(
        (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        {
            message: "La fecha de vencimiento debe tener el formato YYYY-MM-DD",
        }
    ),
    valor_total: z.number().positive("El valor total debe ser un número positivo"),
    moneda: z.string().regex(/^[A-Za-z]{3}$/, "La moneda debe ser un código de tres letras"),
    numero_contrato: z.string().nullable().optional(),
})

export default facturaSchema