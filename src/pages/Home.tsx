import { useEffect, useState } from "react";
import { analizarDatos, extraerMalla, extraerProyecto, listarMallas, listarProyectos, obtenerProgramas } from "../services/programaService";
import type { Programa } from "../model/programa";

function Home() {

  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);

  // abril modal
  const [openModal, setOpenModal] = useState(false); 

  // filtro por programa
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
const [programasFiltrados, setProgramasFiltrados] = useState<Programa[]>([]);
// filtro por sede
const [sedeSeleccionada, setSedeSeleccionada] =
  useState("");

// para manejar mensajes de todo el html----
const [mensaje, setMensaje] =
  useState("");

const [tipoMensaje, setTipoMensaje] =
  useState<"success" | "error" | "">("");
// EXTRAER MALLA
const [loadingMalla, setLoadingMalla] =
  useState<string | null>(null);

const manejarExtraerMalla = async (
  linkMalla: string
) => {

  try {

    setLoadingMalla(linkMalla);

    console.log('====================');
    console.log('BOTON PRESIONADO');
    console.log(linkMalla);
    console.log('====================');

    // VALIDAR LINK
    if (
      !linkMalla ||
      linkMalla.trim() === ""
    ) {

      setTipoMensaje("error");

      setMensaje(
        "No se pudo extraer esta malla, puede que no tenga link."
      );

      setTimeout(() => {

        setMensaje("");
        setTipoMensaje("");

      }, 5000);

      return;

    }

    const respuesta =
      await extraerMalla(linkMalla);

    console.log('====================');
    console.log('MODULOS EXTRAIDOS');
    console.log(respuesta);
    console.log('====================');

    await cargarMallas();

    // MENSAJE EXITO
    setTipoMensaje("success");

    setMensaje(
      "Malla extraída con éxito."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 3000);

  } catch (error) {

    console.log(error);

    setTipoMensaje("error");

    setMensaje(
      "No se pudo extraer esta malla."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 5000);

  } finally {

    setLoadingMalla(null);

  }

};

// LISTAR MALLAS EXTRAIDAS

// LISTA MALLAS
const [mallas, setMallas] =
  useState<any[]>([]);

 

const cargarMallas = async () => {

  try {

    const respuesta =
      await listarMallas();

    setMallas(
      respuesta.data
    );

  } catch (error) {

    console.log(error);

  }

}


// guardar idcodigo para visualizar
const [codigosProyecto, setCodigosProyecto] =
  useState<string[]>([]);

// EXTRAER PROYECTO
const [loadingProyecto, setLoadingProyecto] =
  useState<string | null>(null);

const manejarExtraerProyecto =
async (
  linkProyecto: string,
  codAcadem: string
) => {

  try {

    setLoadingProyecto(
      linkProyecto
    );

    console.log('====================');
    console.log('BOTON PROYECTO PRESIONADO');
    console.log(linkProyecto);
    console.log('CODIGO ACADEMICO');
    console.log(codAcadem);
    console.log('====================');

    // VALIDAR LINK
    if (
      !linkProyecto ||
      linkProyecto.trim() === ""
    ) {

      setTipoMensaje("error");

      setMensaje(
        "No se pudo extraer este proyecto, puede que no tenga link."
      );

      setTimeout(() => {

        setMensaje("");
        setTipoMensaje("");

      }, 5000);

      return;

    }

    const respuesta =
      await extraerProyecto(
        linkProyecto,
      );

    console.log('====================');
    console.log('PROYECTO EXTRAIDO');
    console.log(respuesta);
    console.log('====================');

    // GUARDAR SOLO EL ULTIMO CODIGO
    setCodigosProyecto([
      codAcadem
    ]);

    await cargarProyectos();

    // MENSAJE EXITO
    setTipoMensaje("success");

    setMensaje(
      "Proyecto extraído con éxito."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 3000);

  } catch (error) {

    console.log(error);

    setTipoMensaje("error");

    setMensaje(
      "No se pudo extraer este proyecto."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 5000);

  } finally {

    setLoadingProyecto(null);

  }

};
// listar proyectos extraidos
// LISTAR PROYECTOS EXTRAIDOS

// LISTA PROYECTOS
const [proyectos, setProyectos] =
  useState<any[]>([]);

const cargarProyectos =
async () => {

  try {

    const respuesta =
      await listarProyectos();

    setProyectos(
      respuesta.data
    );

  } catch (error) {

    console.log(error);

  }

};


// ANALIZAR DATOS EXTRAIDOS
const [reporte, setReporte] =
  useState<any>(null);

const [openReporte, setOpenReporte] =
  useState(false);

const [analizando, setAnalizando] =
  useState(false);

// metodo analizar----------
const manejarAnalisis =
async () => {

  try {

    setAnalizando(true);

    const respuesta =
      await analizarDatos();

    console.log(
      "REPORTE ANALISIS",
      respuesta
    );

    setReporte(
      respuesta
    );

    alert(
      "Análisis completado"
    );

  } catch (error) {

    console.log(error);

    alert(
      "Error al analizar datos"
    );

  } finally {

    setAnalizando(false);

  }

};


// LIMPIAR MEMORIA SOLO PROYECTO
// LIMPIAR MEMORIA
const manejarLimpiarMemoriaProyecto =
async () => {

  try {

   

    // const respuestaProyectos =
    //   await limpiarProyectos();

    // LIMPIAR FRONTEND
    
    setProyectos([]);
    setReporte(null);

    // MENSAJE EXITO
    setTipoMensaje("success");

    setMensaje(
      "Datos de memoria limpiados con éxito."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 3000);

  } catch (error) {

    console.log(error);

    setTipoMensaje("error");

    setMensaje(
      "No se pudieron limpiar los datos."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 5000);

  }

};

// LIMPIAR MEMORIAAMBOS
const manejarLimpiarMemoria =
async () => {

  try {

    // const respuestaMallas =
    //   await limpiarMallas();

    // const respuestaProyectos =
    //   await limpiarProyectos();

    // LIMPIAR FRONTEND
    setMallas([]);
    setProyectos([]);
    setReporte(null);

    // MENSAJE EXITO
    setTipoMensaje("success");

    setMensaje(
      "Datos de memoria limpiados con éxito."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 3000);

  } catch (error) {

    console.log(error);

    setTipoMensaje("error");

    setMensaje(
      "No se pudieron limpiar los datos."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 5000);

  }

};

const normalizarTexto = (texto: string) => {

  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

};

// lista unica de sedes
const sedesUnicas = [
  ...new Set(
    programas.map((item) => item.sede)
  )
];

// lista unica para filtrarPrograma
const programasUnicos = [
  ...new Set(
    programas.map((item) => item.nuevoPrograma)
  )
];

// metodo de filtro
// metodo de filtro combinado
const filtrarPrograma = (
  nombrePrograma: string,
  sede: string = sedeSeleccionada
) => {

  setProgramaSeleccionado(nombrePrograma);

  let filtrados = programas;

  // filtro por programa
  if (nombrePrograma !== "") {

    filtrados = filtrados.filter(
      (item) =>
        normalizarTexto(item.nuevoPrograma) ===
        normalizarTexto(nombrePrograma)
    );

  }

  // filtro por sede
  if (sede !== "") {

    filtrados = filtrados.filter(
      (item) =>
        normalizarTexto(item.sede) ===
        normalizarTexto(sede)
    );

  }

  setProgramasFiltrados(filtrados);

};



const filtrarSede = (sede: string) => {

  setSedeSeleccionada(sede);

  filtrarPrograma(programaSeleccionado, sede);

};

  useEffect(() => {

    cargarProgramas();

  }, []);

  const cargarProgramas = async () => {

    try {

      const data = await obtenerProgramas();

    
setProgramas(data);
setProgramasFiltrados(data);
    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="
      min-h-screen
      bg-gray-100 dark:bg-gray-950
      p-4
      transition-colors duration-300
    ">

      <div className="max-w-[1700px] mx-auto">

        {/* HEADER */}

        <div className="mb-5">

          <h1 className="
            text-2xl font-bold
            text-gray-800 dark:text-white
          ">
            Programas Académicos
          </h1>

          <p className="
            text-sm
            text-gray-500 dark:text-gray-400
            mt-1
          ">
            Total programas: {programas.length}
          </p>
 <div
  className="
    flex flex-wrap items-end gap-3
  "
>
{/* CONTENEDOR FILTROS */}

<div className="flex items-end gap-4 flex-wrap">

  {/* FILTRO PROGRAMA */}

  <div className="flex flex-col">

    <label
      className="
        text-[11px]
        font-medium
        text-gray-600 dark:text-gray-400
        mb-1
      "
    >
      Filtrar por programa
    </label>

    <select
      value={programaSeleccionado}
      onChange={(e) =>
        filtrarPrograma(e.target.value)
      }
      className="
        w-[520px]
        px-3 py-2
        text-xs
        rounded-lg
        border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-700 dark:text-gray-200
        focus:outline-none
        focus:ring-2 focus:ring-blue-500/40
      "
    >

      <option value="">
        Todos los programas
      </option>

      {programasUnicos.map((programa, index) => (

        <option
          key={index}
          value={programa}
        >
          {programa}
        </option>

      ))}

    </select>

  </div>

  {/* FILTRO SEDE */}

  <div className="flex flex-col">

    <label
      className="
        text-[11px]
        font-medium
        text-gray-600 dark:text-gray-400
        mb-1
      "
    >
      Filtrar por sede
    </label>

    <select
className="
        w-[180px]
        px-3 py-2
        text-xs
        rounded-lg
        border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-700 dark:text-gray-200
        focus:outline-none
        focus:ring-2 focus:ring-blue-500/40
      "
  value={sedeSeleccionada}

  onChange={(e) =>
    filtrarSede(e.target.value)
  }

>
  <option value="">
    Todas las sedes
  </option>

  {sedesUnicas.map((sede, index) => (

    <option
      key={index}
      value={sede}
    >
      {sede}
    </option>

  ))}

</select>

 

  </div>

</div>

  {/* botón ver datos */}
  <button  onClick={() => setOpenModal(true)}
    className="
      px-4 py-2
      text-xs font-medium
      rounded-lg
      bg-blue-600 hover:bg-blue-700
      text-white
        cursor-pointer
  disabled:cursor-not-allowed
      transition
    "
  >
    Ver datos extraídos
  </button>

  {/* botón limpiar memoria */}
  <button
  onClick={manejarLimpiarMemoria}
  className="
    px-4 py-2
    text-xs font-medium
    rounded-lg
    bg-red-600 hover:bg-red-700
    text-white
    transition
    cursor-pointer
  "
>
  Limpiar datos de memoria
</button>
</div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="
            flex justify-center items-center
            h-40
          ">

            <p className="
              text-sm
              text-gray-600 dark:text-gray-300
            ">
              Cargando programas...
            </p>

          </div>

        ) : (

        <div
  className="
    overflow-x-auto
    overflow-y-auto
    max-h-[600px]
    rounded-xl
    border border-gray-200 dark:border-gray-800
    bg-white dark:bg-gray-900
    shadow-sm
  "
>


  <table
    className="
      w-full
      text-xs
      border-collapse
    "
  >

    {/* HEADER */}

    <thead
  className="
    sticky top-0 z-10
    bg-gray-200 dark:bg-gray-800
    text-gray-700 dark:text-gray-200
  "
>
      <tr>

        {/* CODIGO */}

        <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
          Código
        </th>

        {/* PROGRAMA */}

        <th className="px-3 py-3 text-left font-semibold w-full">
          Programa
        </th>

        {/* TIPO */}

        <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
          Tipo
        </th>

        {/* VERSION */}

        <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
          Ver.
        </th>

        {/* SEDE */}

        <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
          Sede
        </th>

        {/* ESTADO */}

        <th className="px-2 py-3 text-center font-semibold whitespace-nowrap">
          Estado
        </th>

        {/* ACCIONES */}

        <th className="px-2 py-3 text-center font-semibold whitespace-nowrap">
          Acción
        </th>

      </tr>
    </thead>

    {/* BODY */}

    <tbody>

      {programasFiltrados.map((programa, index) => (

        <tr
          key={index}
          className="
            border-t border-gray-200 dark:border-gray-800
            hover:bg-gray-50 dark:hover:bg-gray-800/60
            transition
          "
        >

          {/* CODIGO */}

          <td
            onClick={() =>
              programa.linkProyecto &&
              window.open(programa.linkProyecto, "_blank")
            }
            className="
              px-3 py-3
              whitespace-nowrap
              font-medium
              text-gray-700 dark:text-gray-200
              cursor-pointer
              hover:underline
              hover:text-blue-600
              transition
            "
          >
            {programa.codAcadem}
          </td>

          {/* PROGRAMA */}

          <td
            className="
              px-3 py-3
              text-gray-700 dark:text-gray-300
              leading-5
            "
          >
            {programa.nuevoPrograma}
          </td>

          {/* TIPO */}

          <td className="px-3 py-3 whitespace-nowrap">

            <span
              className="
                px-2.5 py-1
                rounded-md
                text-[10px]
                font-semibold
                bg-blue-100 text-blue-700
                dark:bg-blue-900/40 dark:text-blue-300
              "
            >
              {programa.tipo}
            </span>

          </td>

          {/* VERSION */}

          <td
            className="
              px-3 py-3
              whitespace-nowrap
              text-gray-700 dark:text-gray-300
            "
          >
            {programa.version}
          </td>

          {/* SEDE */}

          <td
            className="
              px-3 py-3
              whitespace-nowrap
              text-gray-700 dark:text-gray-300
            "
          >
            {programa.sede}
          </td>

          {/* ESTADO */}

          <td className="px-2 py-3 text-center whitespace-nowrap">

            <span
              className={`
                px-2.5 py-1
                rounded-md
                text-[10px]
                font-bold
                ${
                  programa.estado === "INSCRITO"
                    ? `
                      bg-green-100 text-green-700
                      dark:bg-green-900/40 dark:text-green-300
                    `
                    : `
                      bg-yellow-100 text-yellow-700
                      dark:bg-yellow-900/40 dark:text-yellow-300
                    `
                }
              `}
            >
              {programa.estado}
            </span>

          </td>

          {/* BOTONES */}

          <td className="px-2 py-3">

            <div className="flex justify-center gap-2">

              {/* BOTON MALLA */}

              <button
                onClick={() =>
                  manejarExtraerMalla(programa.linkMalla)
                }
                disabled={
                  loadingMalla === programa.linkMalla
                }
                className="
                  px-3 py-1.5
                  rounded-md
                  bg-blue-600 hover:bg-blue-700
                  disabled:bg-blue-400
                  text-white
                  text-[11px]
                  font-medium
                  cursor-pointer
                  disabled:cursor-not-allowed
                  transition
                  whitespace-nowrap
                "
              >
                {
                  loadingMalla === programa.linkMalla
                    ? "Cargando..."
                    : "Malla"
                }
              </button>

              {/* BOTON PROYECTO */}

              <button
                onClick={() =>
                  manejarExtraerProyecto(
                    programa.linkProyecto,
                    programa.codAcadem
                  )
                }
                disabled={
                  loadingProyecto ===
                  programa.linkProyecto
                
                }
                className="
                  px-3 py-1.5
                  rounded-md
                  border border-gray-300 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-200
                  text-[11px]
                  font-medium
                  transition
                    cursor-pointer
                    disabled:cursor-not-allowed
                  whitespace-nowrap
                "
              >
                {
                  loadingProyecto === programa.linkProyecto
                    ? "Cargando..."
                    : "Proyecto"
                }
              </button>

            </div>

          </td>

        </tr>

      ))}

    </tbody>

  </table>
</div>

        )}

      </div>


      
{/* modal para ver datos extraídos --------------------*/}
{/* MODAL */}

{openModal && (

  <div className="
    fixed inset-0
    z-50
    flex items-center justify-center
    bg-black/50
    backdrop-blur-sm
    p-4
  ">

    <div className="
  w-full max-w-6xl
  max-h-[90vh]
  overflow-y-auto
  rounded-3xl
  border border-gray-200 dark:border-gray-800
  bg-white dark:bg-gray-900
  shadow-2xl
  p-6
">

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="
          text-2xl font-bold
          text-gray-800 dark:text-white
        ">
          Panel de Datos Extraídos
        </h2>

        <p className="
          mt-1
          text-sm
          text-gray-500 dark:text-gray-400
        ">
          Gestión y análisis de información procesada
        </p>

      </div>

      {/* CONTENIDO */}

      <div className="
        grid grid-cols-1 md:grid-cols-2
        gap-5
      ">

        {/* CARD MALLAS */}

<div className="
  min-h-[380px]
  rounded-2xl
  border border-blue-200 dark:border-blue-900
  bg-blue-50/60 dark:bg-blue-950/20
  p-5
  flex flex-col
">

  <div className="mb-4">

    <h3 className="
      text-sm font-bold
      text-blue-700 dark:text-blue-300
    ">
      DATOS EXTRAÍDOS DE LAS MALLAS
    </h3>

  </div>

  {/* LISTA */}

  <div className="
    flex-1
    rounded-2xl
    border-2 border-dashed
    border-blue-300 dark:border-blue-800
    bg-white/60 dark:bg-gray-900/40
    p-4
    overflow-auto
  ">

    {
      mallas.length === 0 ? (

        <div className="
          h-full
          flex items-center justify-center
          text-xs
          text-gray-500 dark:text-gray-400
        ">
          No existen mallas extraídas
        </div>

      ) : (

        <div className="space-y-4">

          {mallas.map((malla, index) => (

            <div
              key={index}
              className="
                p-3
                rounded-xl
                border
                border-blue-200 dark:border-blue-800
                bg-white dark:bg-gray-900
              "
            >

              <div className="
                text-[11px]
                font-bold
                text-blue-700 dark:text-blue-300
                mb-2
              ">
                MALLA #{index + 1}
              </div>

              <div className="
                flex flex-col gap-1
              ">

                {
                  malla.map(
                    (
                      modulo: string,
                      i: number
                    ) => (

                      <div
                        key={i}
                        className="
                          text-[11px]
                          text-gray-700 dark:text-gray-300
                          px-2 py-1
                          rounded-md
                          bg-blue-100/60
                          dark:bg-blue-900/20
                        "
                      >
                        {`${i + 1}: ${modulo}`}
                      </div>

                    )
                  )
                }

              </div>

            </div>

          ))}

        </div>

      )
    }

  </div>

</div>

        {/* CARD PROYECTOS */}
<div className="
  min-h-[380px]
  rounded-2xl
  border border-purple-200 dark:border-purple-900
  bg-purple-50/60 dark:bg-purple-950/20
  p-5
  flex flex-col
  text-gray-800 dark:text-gray-100
">

  {
    proyectos.length === 0 ? (

      <div className="
        h-full
        flex items-center justify-center
        text-xs
        text-gray-500 dark:text-gray-400
      ">
        No existen proyectos extraídos
      </div>

    ) : (

      <div className="space-y-4">

        {proyectos.map((proyecto, index) => (

          <div
            key={index}
            className="
              p-3
              rounded-xl
              border border-purple-200 dark:border-purple-800
              bg-white dark:bg-gray-900
              text-gray-800 dark:text-gray-100
            "
          >

            {/* TITULO */}
            <div className="
              text-[11px]
              font-bold
              text-purple-700 dark:text-purple-300
              mb-3
            ">
              PROYECTO #{index + 1} - Codigo: {codigosProyecto[index] || "SIN CÓDIGO"}
            </div>

            {/* PLAN TEMATICO */}
            <div className="mb-3">

              <div className="
                text-[11px]
                font-semibold
                text-purple-600 dark:text-purple-300
                mb-1
              ">
                PLAN TEMÁTICO
              </div>

              {proyecto.planTematico?.map(
                (item: string, i: number) => (

                  <div
                    key={i}
                    className="
                      text-[11px]
                      px-2 py-1
                      mb-1
                      rounded-md
                      bg-purple-100/60 dark:bg-purple-900/20
                      text-gray-700 dark:text-gray-200
                    "
                  >
                    {`${i + 1}: ${item}`}
                  </div>

                )
              )}

            </div>

            {/* FONDO DE TIEMPO */}
            <div className="mb-3">

              <div className="
                text-[11px]
                font-semibold
                text-purple-600 dark:text-purple-300
                mb-1
              ">
                FONDO DE TIEMPO
              </div>

              {proyecto.fondoTiempo?.map(
                (item: string, i: number) => (

                  <div
                    key={i}
                    className="
                      text-[11px]
                      px-2 py-1
                      mb-1
                      rounded-md
                      bg-purple-100/60 dark:bg-purple-900/20
                      text-gray-700 dark:text-gray-200
                    "
                  >
                    {`${i + 1}: ${item}`}
                  </div>

                )
              )}

            </div>

            {/* CRONOGRAMA */}
            <div className="mb-3">

              <div className="
                text-[11px]
                font-semibold
                text-purple-600 dark:text-purple-300
                mb-1
              ">
                CRONOGRAMA
              </div>

              {proyecto.cronograma?.map(
                (item: string, i: number) => (

                  <div
                    key={i}
                    className="
                      text-[11px]
                      px-2 py-1
                      mb-1
                      rounded-md
                      bg-purple-100/60 dark:bg-purple-900/20
                      text-gray-700 dark:text-gray-200
                    "
                  >
                    {`${i + 1}: ${item}`}
                  </div>

                )
              )}

            </div>

            {/* CLAUSTRO DOCENTE */}
            <div>

              <div className="
                text-[11px]
                font-semibold
                text-purple-600 dark:text-purple-300
                mb-1
              ">
                CLAUSTRO DOCENTE
              </div>

              {proyecto.claustroDocente?.map(
                (item: string, i: number) => (

                  <div
                    key={i}
                    className="
                      text-[11px]
                      px-2 py-1
                      mb-1
                      rounded-md
                      bg-purple-100/60 dark:bg-purple-900/20
                      text-gray-700 dark:text-gray-200
                    "
                  >
                    {`${i + 1}: ${item}`}
                  </div>

                )
              )}

            </div>

          </div>

        ))}

      </div>

    )
  }

  {/* AREA VACÍA */}
  <div className="
    flex-1
    rounded-2xl
    border-2 border-dashed
    border-purple-300 dark:border-purple-800
    bg-white/60 dark:bg-gray-900/40
  " />

</div>

      </div>

      {/* BOTONES */}

      <div className="
        mt-6
        flex flex-wrap
        items-center justify-between
        gap-4
      ">

        {/* ACCIONES */}

        <div className="
          flex flex-wrap gap-3
        ">

          <button
  onClick={manejarAnalisis}
  disabled={analizando}
  className="
    px-5 py-2
    rounded-xl
    bg-blue-600 hover:bg-blue-700
    disabled:opacity-50
    text-white
      cursor-pointer
  disabled:cursor-not-allowed
    text-xs font-semibold
    transition
  "
>
  {
    analizando
      ? "ANALIZANDO..."
      : "ANALIZAR Y COMPARAR DATOS"
  }
</button>

          <button
           onClick={manejarLimpiarMemoriaProyecto}
            className="
              px-5 py-2
              rounded-xl
              bg-red-600 hover:bg-red-700
              text-white
                cursor-pointer
  disabled:cursor-not-allowed
              text-xs font-semibold
              transition
            "
          >
            LIMPIAR PROYECTO
          </button>

          <button
  onClick={() => {

    if (!reporte) {

      alert(
        "Primero debe analizar los datos"
      );

      return;

    }

    setOpenReporte(true);

  }}
  className="
    px-5 py-2
    rounded-xl
    bg-emerald-600 hover:bg-emerald-700
    text-white
    text-xs font-semibold
    transition
      cursor-pointer
  disabled:cursor-not-allowed
  "
>
  VER REPORTES
</button>

        </div>

        {/* SALIR */}

        <button
          onClick={() => setOpenModal(false)}
          className="
            px-5 py-2
            rounded-xl
            bg-gray-800 hover:bg-black
            text-white
              cursor-pointer
  disabled:cursor-not-allowed
            text-sm font-medium
            transition
          "
        >
          Salir
        </button>

      </div>

    </div>

  </div>

)}

{/* modal ver reportes del analisis */}

{/* MODAL REPORTES */}
{
  openReporte && reporte && (
    <div
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/60 dark:bg-black/80
        backdrop-blur-sm
        p-3
      "
    >
      <div
        className="
          w-full max-w-7xl
          max-h-[92vh]
          overflow-y-auto

          rounded-2xl

          bg-white
          dark:bg-slate-900

          border
          border-gray-200
          dark:border-slate-700

          shadow-2xl

          p-4
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reporte de Comparación - Codigo del Programa: {codigosProyecto || "SIN CÓDIGO"}
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Resumen de coincidencias y diferencias
            </p>
          </div>

          <button
            onClick={() => setOpenReporte(false)}
            className="
              h-8 w-8
              rounded-lg
              bg-gray-100 hover:bg-gray-200
              dark:bg-slate-800 dark:hover:bg-slate-700
              text-gray-600 dark:text-gray-300
              transition
            "
          >
            ✕
          </button>
        </div>

        {/* RESUMEN */}
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* ... (sin cambios) */}
        </div>

        {/* DETALLE */}
        <div className="space-y-3">
          {reporte.reporte?.map((fila: any, index: number) => (
            <div
              key={index}
              className={`
                rounded-xl border

                ${
                  fila.estado === "IDENTICO"
                    ? "border-green-200 dark:border-green-800"
                    : fila.tieneFaltantes
                    ? "border-amber-200 dark:border-amber-800"
                    : "border-red-200 dark:border-red-800"
                }
              `}
            >
              {/* CABECERA FILA */}
              <div
                className={`
                  flex items-center justify-between
                  px-3 py-2 border-b

                  ${
                    fila.estado === "IDENTICO"
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                      : fila.tieneFaltantes
                      ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                      : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                  }
                `}
              >
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  FILA {fila.fila}
                </div>

                <span className="
                  px-2 py-0.5 rounded-full
                  text-[10px] font-medium
                  bg-white dark:bg-slate-800
                  border border-gray-200 dark:border-slate-700
                ">
                  {fila.estado}
                </span>
              </div>

              {/* TABLA */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <tbody>
                    {fila.registros?.map((reg: any, i: number) => (
                      <tr
                        key={i}
                        className="
                          border-b border-gray-100 dark:border-slate-800
                          last:border-0
                        "
                      >
                        {/* ORIGEN */}
                        <td className="
                          w-40 px-3 py-2
                          font-semibold
                          text-blue-600 dark:text-blue-400
                          whitespace-nowrap
                        ">
                          {reg.origen}
                        </td>

                        {/* TEXTO */}
                        <td className="
                          px-3 py-2
                          text-gray-700 dark:text-gray-300
                          break-words
                        ">
                          {reg.texto || (
                            <span className="italic text-red-500">
                              SIN REGISTRO
                            </span>
                          )}
                        </td>

                        {/* 🔥 NUEVO: ID PROGRAMA A LA DERECHA */}
                        <td className="
                          w-44
                          px-3 py-2
                          text-right
                          text-[10px]
                          font-semibold
                          text-purple-600 dark:text-purple-300
                          whitespace-nowrap
                        ">
                          {reg.idPrograma ?? reg.codAcadem ?? "—"}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="
          mt-4 pt-3
          border-t border-gray-200 dark:border-slate-700
          flex justify-end
        ">
          <button
            onClick={() => setOpenReporte(false)}
            className="
              px-4 py-2
              rounded-lg
              text-sm
              bg-slate-900 hover:bg-black
              dark:bg-blue-600 dark:hover:bg-blue-500
              text-white
              transition
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

{/* aqui serria el modal de reportes */}



{/* sierre de modal---------------------- */}

{/* mensaje para mostrar--------------- */}
{
  mensaje && (
    <div
      className={`
        fixed top-5 right-5
        px-4 py-3
        rounded-lg
        shadow-lg
        text-white
        z-50
        transition-all
        duration-300
        ${
          tipoMensaje === "success"
            ? "bg-green-600"
            : "bg-red-600"
        }
      `}
    >
      {mensaje}
    </div>
  )
}

{/* finaliza el mensaje aqui------ */}


    </div>

  );

}

export default Home;