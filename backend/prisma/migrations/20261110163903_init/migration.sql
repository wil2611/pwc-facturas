-- CreateTable
CREATE TABLE "proveedores" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" UUID NOT NULL,
    "proveedor_id" UUID NOT NULL,
    "numero_factura" VARCHAR(100) NOT NULL,
    "fecha_emision" DATE NOT NULL,
    "fecha_vencimiento" DATE,
    "valor_total" DECIMAL(18,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL,
    "numero_contrato" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" UUID NOT NULL,
    "factura_id" UUID NOT NULL,
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "tipo_archivo" VARCHAR(100) NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "fecha_carga" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respuesta_llm" JSONB NOT NULL,
    "ruta_archivo" VARCHAR(500),

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "facturas_fecha_emision_idx" ON "facturas"("fecha_emision");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_proveedor_id_numero_factura_key" ON "facturas"("proveedor_id", "numero_factura");

-- CreateIndex
CREATE UNIQUE INDEX "documentos_factura_id_key" ON "documentos"("factura_id");

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
