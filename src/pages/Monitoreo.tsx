import { useEffect, useState } from "react";

import type { Monitoreo } from "../model/monitoreo";

import {
  actualizarResultado,
  analizarDatosNuevos,
  extraerNotas,
  extraerProyectoNuevo,
  limpiarNotas,
  limpiarProyectosNuevos,
  listarNotas,
  listarProyectosNuevos,
  obtenerProgramasNuevos
} from "../services/monitoreoService";

import {
  obtenerProgramas,
  extraerMalla,
  listarMallas,
  limpiarMallas
} from "../services/programaService";






function MonitoreoPage() {

// funciones para mallas
const [codigoMalla, setCodigoMalla] =
  useState("");

const [mallas, setMallas] =
  useState<any[]>([]);

const [loadingMalla, setLoadingMalla] =
  useState(false);

const [programasMalla, setProgramasMalla] =
  useState<any[]>([]);


const cargarProgramasMalla =
async () => {

  try {

    const data =
      await obtenerProgramas();

    setProgramasMalla(data);

  } catch (error) {

    console.log(error);

  }

};

const buscarMallaPorCodigo =
async (codigo: string) => {

  try {

    if (!codigo.trim()) return;

    setLoadingMalla(true);

    const programa =
      programasMalla.find(
        (item) =>
          item.codAcadem
            .trim()
            .toLowerCase() ===
          codigo
            .trim()
            .toLowerCase()
      );

    if (!programa) {

      alert(
        "No se encontró el código"
      );

      return;
    }

    await extraerMalla(
      programa.linkMalla
    );

    const resultado =
      await listarMallas();
      console.log(resultado);


    setMallas(resultado.data[0]);

  } catch (error) {

    console.log(error);

    alert(
      "Error al extraer malla"
    );

  } finally {

    setLoadingMalla(false);

  }

};



  // LIMPIAR MEMORIA
 const manejarLimpiarMemoriaMalla =
async () => {

  try {

    await limpiarMallas();

    setMallas([]);
    setCodigoMalla("");

    setReporte(null);

    setTipoMensaje("success");

    setMensaje(
      "Datos de mallas eliminados correctamente."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 3000);

  } catch (error) {

    console.log(error);

    setTipoMensaje("error");

    setMensaje(
      "No se pudieron limpiar las mallas."
    );

    setTimeout(() => {

      setMensaje("");
      setTipoMensaje("");

    }, 5000);

  }

};



const normalizarTexto1 = (
  texto: string
) => {

  return texto
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

};

const manejarAnalisis1 = () => {

  if (
    notas.length === 0 ||
    mallas.length === 0
  ) {

    alert(
      "Debe tener notas y mallas cargadas"
    );

    return;
  }

  const notasLista =
    Array.isArray(notas[0])
      ? notas[0]
      : [];

  const totalFilas =
    Math.max(
      notasLista.length,
      mallas.length
    );

  const resultado = [];

  for (
    let i = 0;
    i < totalFilas;
    i++
  ) {

    const nota =
      notasLista[i] || "";

    const malla =
      mallas[i] || "";

    const iguales =
      normalizarTexto1(nota) ===
      normalizarTexto1(malla);

    resultado.push({

      fila: i + 1,

      estado: iguales
        ? "IDENTICO"
        : "DIFERENTE",

      registros: [

        {
          origen: "NOTA",
          texto: nota
        },

        {
          origen: "MALLA",
          texto: malla
        }

      ]

    });

  }

  setReporte({
    reporte: resultado
  });

};


  // aqui terminar funciones de mallas














  const [programas, setProgramas] = useState<Monitoreo[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
    const [openModal1, setOpenModal1] = useState(false);

  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [programasFiltrados, setProgramasFiltrados] = useState<Monitoreo[]>([]);

  const [responsableSeleccionado, setResponsableSeleccionado] = useState("");
  const [notasSistemaSeleccionadas, setNotasSistemaSeleccionadas] = useState<string[]>([]);


  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "">("");

  const [loadingNota, setLoadingNota] = useState<string | null>(null);
  const [loadingProyecto, setLoadingProyecto] = useState<string | null>(null);

  const [notas, setNotas] = useState<any[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);

  const [reporte, setReporte] = useState<any>(null);
  const [analizando, setAnalizando] = useState(false);

  const [openReporte, setOpenReporte] = useState(false);
   const [openReporte1, setOpenReporte1] = useState(false);


  // metodo para checbok excel
const manejarResultado = async (
  codAcadem: string
) => {

  try {

    await actualizarResultado(
      codAcadem
    );

    setProgramasFiltrados(prev =>
      prev.map(item =>
        item.codAcadem === codAcadem
          ? { ...item, resultado: "OK" }
          : item
      )
    );

    await cargarProgramas();

    aplicarFiltros(
      programaSeleccionado,
      responsableSeleccionado,
      notasSistemaSeleccionadas
    );

  } catch (error) {

    console.log(error);

    alert(
      "Error al actualizar resultado"
    );
  }
};

  // =========================
  // NORMALIZAR TEXTO
  // =========================
  const normalizarTexto = (texto: string) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  };

  // =========================
  // FILTRO
  // =========================
  const programasUnicos = [
    ...new Set(programas.map((item) => item.programa))
  ];

  const responsablesUnicos = [
  ...new Set(
    programas
      .map((item) => item.responsable?.trim())
      .filter((r) => r && r !== "")
  )
];
// =========================
// NORMALIZAR NOTAS SISTEMA
// =========================
const normalizarNotasSistema = (
  texto: string
) => {

  const valor = normalizarTexto(texto);

  // =========================
  // IGNORAR BASURA
  // =========================
  if (
    valor === "#n/a" ||
    valor === "n/a" ||
    valor === "-"
  ) {
    return null;
  }

  // =========================
  // SI
  // =========================
  if (
    valor.includes("si") &&
    valor.includes("reporte")
  ) {
    return "SI (reporte listo)";
  }

  if (valor === "si") {
    return "SI";
  }

  // =========================
  // SUBIR
  // =========================
  if (
    valor.includes("subir") &&
    valor.includes("no listo")
  ) {
    return "SUBIR (reporte no listo)";
  }

  if (
    valor.includes("subir") &&
    valor.includes("reporte")
  ) {
    return "SUBIR (reporte listo)";
  }

  if (valor === "subir") {
    return "SUBIR";
  }

  // =========================
  // EN DESARROLLO
  // =========================
  if (
    valor.includes("desarrollo")
  ) {
    return "EN DESARROLLO";
  }

  // =========================
  // NO
  // =========================
  if (
    valor === "no" ||
    valor.includes("no corresponde")
  ) {
    return "NO";
  }

  // =========================
  // DEFAULT
  // =========================
  return texto.trim();
};

// =========================
// CHECKBOX ÚNICOS
// =========================
const notasSistemaUnicos = [

  ...new Set(

    programas
      .map((item) =>
        normalizarNotasSistema(
          item.notasSistema || ""
        )
      )
      .filter(Boolean)
  )
];

const [busquedaPrograma, setBusquedaPrograma] = useState("");
const aplicarFiltros = (
  programa: string,
  responsable: string,
  notasSeleccionadas: string[]
) => {

  setProgramaSeleccionado(programa);

  setResponsableSeleccionado(
    responsable
  );

  setNotasSistemaSeleccionadas(
    notasSeleccionadas
  );

  let filtrados = [...programas];

  // =========================
  // FILTRO PROGRAMA
  // =========================
  if (programa !== "") {

    filtrados = filtrados.filter(
      (item) =>
        normalizarTexto(item.programa) ===
        normalizarTexto(programa)
    );
  }

  // =========================
  // FILTRO RESPONSABLE
  // =========================
  if (responsable !== "") {

    filtrados = filtrados.filter(
      (item) =>
        normalizarTexto(
          item.responsable || ""
        ) ===
        normalizarTexto(responsable)
    );
  }

  // =========================
  // FILTRO NOTAS SISTEMA
  // =========================
  // =========================
// FILTRO NOTAS SISTEMA
// =========================
if (notasSeleccionadas.length > 0) {

  filtrados = filtrados.filter(
    (item) =>

      notasSeleccionadas.some(
        (nota) =>

          normalizarNotasSistema(
            item.notasSistema || ""
          ) === nota
      )
  );
}

  setProgramasFiltrados(filtrados);
};

  // =========================
  // CARGAR PROGRAMAS
  // =========================
  const cargarProgramas = async () => {

    try {

      const data = await obtenerProgramasNuevos();

      setProgramas(data);
      setProgramasFiltrados(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    cargarProgramas();
  }, []);

  // =========================
  // NOTAS (ANTES MALLAS)
  // =========================
  const manejarExtraerNota = async (link: string) => {

    try {

      setLoadingNota(link);

      if (!link || link.trim() === "") {

        setTipoMensaje("error");
        setMensaje("No se pudo extraer notas.");

        setTimeout(() => {
          setMensaje("");
          setTipoMensaje("");
        }, 4000);

        return;
      }

      await extraerNotas(link);
      await cargarNotas();

      setTipoMensaje("success");
      setMensaje("Notas extraídas correctamente.");

      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 3000);

    } catch (error) {

      console.log(error);

      setTipoMensaje("error");
      setMensaje("Error al extraer notas.");

    } finally {
      setLoadingNota(null);
    }
  };

  const cargarNotas = async () => {

    try {
      const res = await listarNotas();
      setNotas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // PROYECTO
  // =========================
// datos para guardar ------------------
// guardar idcodigo para visualizar
const [codigosProyecto, setCodigosProyecto] =
  useState<string[]>([]);


  const manejarExtraerProyecto = async (link: string,  codAcadem: string) => {

    try {

      setLoadingProyecto(link);

      if (!link || link.trim() === "") {

        setTipoMensaje("error");
        setMensaje("No se pudo extraer proyecto.");

        setTimeout(() => {
          setMensaje("");
          setTipoMensaje("");
        }, 4000);

        return;
      }

      await extraerProyectoNuevo(link);
      // GUARDAR SOLO EL ULTIMO CODIGO
    setCodigosProyecto([
      codAcadem
    ]);
      await cargarProyectos();

      setTipoMensaje("success");
      setMensaje("Proyecto extraído correctamente.");

      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 3000);

    } catch (error) {

      console.log(error);

      setTipoMensaje("error");
      setMensaje("Error al extraer proyecto.");

    } finally {
      setLoadingProyecto(null);
    }
  };

  const cargarProyectos = async () => {

    try {
      const res = await listarProyectosNuevos();
      setProyectos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // ANALISIS
  // =========================
  const manejarAnalisis = async () => {

    try {

      setAnalizando(true);

      const res = await analizarDatosNuevos();

      setReporte(res);

      alert("Análisis completado");

    } catch (error) {

      console.log(error);
      alert("Error en análisis");

    } finally {
      setAnalizando(false);
    }
  };

  // =========================
  // LIMPIAR
  // =========================

  // LIMPIAR MEMORIA
  const manejarLimpiarMemoriaProyecto =
  async () => {
  
    try {
  
     
  
      // const respuestaProyectos =
      //   await limpiarProyectosNuevos();
  
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


  const limpiarTodo = async () => {

    try {

      await limpiarNotas();
      await limpiarProyectosNuevos();

      setNotas([]);
      setProyectos([]);
      setReporte(null);

      setTipoMensaje("success");
      setMensaje("Datos limpiados correctamente.");

    } catch (error) {

      console.log(error);

      setTipoMensaje("error");
      setMensaje("Error al limpiar datos.");
    }
  };

 return (
  <div className="max-w-[1700px] mx-auto">

    {/* HEADER */}

    <div className="mb-5">

      <h1 className="
        text-2xl font-bold
        text-gray-800 dark:text-white
      ">
        Monitoreo Académico
      </h1>


{/* =========================
    FILTRO NOTAS SISTEMA
========================= */}

<div className="mt-4">

  <label className="
    text-[11px]
    font-medium
    text-gray-600 dark:text-gray-400
    block mb-2
  ">
    Filtrar por notas sistema
  </label>

  <div className="
    flex flex-wrap gap-4
  ">

    {notasSistemaUnicos.map(
      (nota, index) => {

        const checked =
          notasSistemaSeleccionadas.includes(
            nota!
          );

        return (

          <label
            key={index}
            className="
              flex items-center gap-2
              text-xs
              text-gray-700 dark:text-gray-200
              cursor-pointer
            "
          >

            <input
              type="checkbox"
              checked={checked}

              onChange={(e) => {

                let nuevasNotas = [
                  ...notasSistemaSeleccionadas
                ];

                if (e.target.checked) {

                  nuevasNotas.push(nota!);

                } else {

                  nuevasNotas =
                    nuevasNotas.filter(
                      (n) => n !== nota
                    );
                }

                aplicarFiltros(
                  programaSeleccionado,
                  responsableSeleccionado,
                  nuevasNotas
                );
              }}

              className="
                w-4 h-4
              "
            />

            {nota}

          </label>
        );
      }
    )}

  </div>

</div>



      <p className="
        text-sm
        text-gray-500 dark:text-gray-400
        mt-1
      ">
        Total registros: {programas.length}
      </p>

      {/* FILTRO + BOTONES */}
      <div className="flex flex-wrap items-end gap-3">

        {/* filtro */}
        <div className="flex flex-col">

          <label className="
            text-[11px]
            font-medium
            text-gray-600 dark:text-gray-400
            mb-1
          ">
            Filtrar por programa
          </label>

         {/* AUTOCOMPLETE PROGRAMAS */}
<div className="relative w-[700px]">

  {/* INPUT PRINCIPAL */}
  <input
    type="text"
    value={busquedaPrograma}
    onChange={(e) => {
      const value = e.target.value;

      setBusquedaPrograma(value);

      // si se borra el input → reset real
      if (value === "") {
        setProgramaSeleccionado("");
        aplicarFiltros("", responsableSeleccionado, notasSistemaSeleccionadas);
      }
    }}
    placeholder="Buscar programa..."
    className="
      w-full
      px-3 py-2
      text-xs
      rounded-lg
      border border-gray-300 dark:border-gray-700
      bg-white dark:bg-gray-900
      text-gray-700 dark:text-gray-200
      focus:outline-none
      focus:ring-2 focus:ring-blue-500/40
    "
  />

  {/* DROPDOWN */}
  {busquedaPrograma && (
    <div className="
      absolute
      z-50
      w-full
      mt-1
      max-h-60
      overflow-y-auto
      rounded-lg
      border border-gray-300 dark:border-gray-700
      bg-white dark:bg-gray-900
      shadow-lg
    ">

      {/* OPCIÓN: FILTRAR TODOS */}
      <div
        className="
          px-3 py-2
          text-xs
          cursor-pointer
          text-gray-500
          hover:bg-gray-100 dark:hover:bg-gray-800
        "
        onClick={() => {
          setProgramaSeleccionado("");
          setBusquedaPrograma("");
          aplicarFiltros("", responsableSeleccionado, notasSistemaSeleccionadas);
        }}
      >
        🔎 Filtrar todos los programas
      </div>

      {/* LISTA FILTRADA */}
      {programasUnicos
        .filter((programa) =>
          normalizarTexto(programa).includes(
            normalizarTexto(busquedaPrograma)
          )
        )
        .map((programa, index) => (
          <div
            key={index}
            className="
              px-3 py-2
              text-xs
              cursor-pointer
              text-gray-700 dark:text-gray-200
              hover:bg-blue-100 dark:hover:bg-blue-900
            "
            onClick={() => {
              setProgramaSeleccionado(programa);
              setBusquedaPrograma(programa);

              aplicarFiltros(
                programa,
                responsableSeleccionado,
                notasSistemaSeleccionadas
              );
            }}
          >
            {programa}
          </div>
        ))}

    </div>
  )}

</div>
        </div>



       <div className="flex flex-col">

  <label className="
    text-[11px]
    font-medium
    text-gray-600 dark:text-gray-400
    mb-1
  ">
    Filtrar por responsable
  </label>

  <select
    value={responsableSeleccionado}
    onChange={(e) =>
      aplicarFiltros(
  programaSeleccionado,
  e.target.value,
  notasSistemaSeleccionadas
)
    }
    className="
      w-[220px]
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
      Todos los responsables
    </option>

    {responsablesUnicos.map(
      (responsable, index) => (
        <option
          key={index}
          value={responsable}
        >
          {responsable}
        </option>
      )
    )}

  </select>

</div>

        {/* limpiar */}
        <button
          onClick={limpiarTodo}
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
          Limpiar datos
        </button>

        {/* ver modal */}
        <button
          onClick={() => setOpenModal(true)}
          className="
            px-4 py-2
            text-xs font-medium
            rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white
            transition
            cursor-pointer
          "
        >
          Ver datos extraídos
        </button>

             {/* ver modal para malla*/}
        <button
  onClick={() => {
    setOpenModal1(true);
    cargarProgramasMalla();
  }}
  className="
    px-4 py-2
    text-xs font-medium
    rounded-lg
    bg-yellow-600 hover:bg-yellow-700
    text-white
    transition
    cursor-pointer
  "
>
  Analizar con Malla
</button>

      </div>

    </div>

    {/* LOADING */}

    {loading ? (

      <div className="flex justify-center items-center h-40">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Cargando datos...
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

        <table className="w-full text-xs border-collapse">

          {/* HEADER */}
          <thead
          className="
           sticky top-0 z-10
           bg-gray-200 dark:bg-gray-800
           text-gray-700 dark:text-gray-200
           "
           >
            
            <tr>
              <th className="px-3 py-2 text-left">R</th>
              <th className="px-3 py-2 text-left">Código</th>
              <th className="px-3 py-2 text-left min-w-[400px]">Programa</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Versión</th>
              <th className="px-3 py-2 text-left">Sede</th>
              <th className="px-3 py-2 text-center">Acción</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {programasFiltrados.map((item, index) => (

              <tr
                key={index}
                className="
                  border-t border-gray-200 dark:border-gray-800
                  hover:bg-gray-50 dark:hover:bg-gray-800/60
                "
              >
              
              <td className="px-3 py-2 text-center">
  <input
    type="checkbox"
    className="w-4 h-4 cursor-pointer"
    checked={
      item.resultado
        ?.trim()
        .toLowerCase() === "ok"
    }
    onChange={() =>
      manejarResultado(
        item.codAcadem
      )
    }
  />
</td>

                {/* CODIGO */}
                <td  
                className="
                  px-3 py-2
                  font-medium
                  text-gray-700 dark:text-gray-200
               
                ">
                  {item.codAcadem}
                </td>

                {/* PROGRAMA */}
                <td className="
                  px-3 py-2
                  text-gray-700 dark:text-gray-300
                  leading-5
                ">
                  {item.programa}
                </td>

                {/* TIPO */}
                <td className="px-3 py-2">
                  <span
                  onClick={() =>
              item.linkProyecto &&
              window.open(item.linkProyecto, "_blank")
            }
                   className="
                    px-2 py-1
                    rounded-md
                    text-[10px]
                    font-semibold
                    bg-blue-100 text-blue-700
                    dark:bg-blue-900/40 dark:text-blue-300
                       cursor-pointer
              hover:underline
              hover:text-blue-600
                  ">
                    {item.tipo}
                  </span>
                </td>

                {/* VERSION */}
                <td 
                className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {item.version}
                </td>

                {/* SEDE */}
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {item.sede}
                </td>

                {/* BOTONES */}
                <td className="px-3 py-2">

                  <div className="flex justify-center gap-2">

                    {/* NOTAS */}
                    <button
                      onClick={() =>
                        manejarExtraerNota(item.linkCentralizadorNotas)
                      }
                      disabled={loadingNota === item.linkCentralizadorNotas}
                      className="
                        px-3 py-1
                        rounded-md
                        bg-blue-600 hover:bg-blue-700
                        text-white
                        text-[11px]
                        transition
                        cursor-pointer
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        flex items-center gap-2
                      "
                    >
                      {loadingNota === item.linkCentralizadorNotas ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Cargando...
                        </>
                      ) : (
                        "Extraer Notas"
                      )}
                    </button>

                    {/* PROYECTO */}
                    <button
                      onClick={() =>
                        manejarExtraerProyecto(item.linkProyecto,
                          item.codAcadem
                        )
                      }

                      disabled={loadingProyecto === item.linkProyecto}
                      className="
                        px-3 py-1
                        rounded-md
                        border border-gray-300 dark:border-gray-700
                        text-gray-700 dark:text-gray-200
                        text-[11px]
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        transition
                        cursor-pointer
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        flex items-center gap-2
                      "
                    >
                      {loadingProyecto === item.linkProyecto ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Cargando...
                        </>
                      ) : (
                        "Extraer Proyecto"
                      )}
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}



{/* =========================
    MODAL DATOS EXTRAÍDOS
========================= */}

{openModal && (

  <div className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/50 backdrop-blur-sm
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

       {/* =========================
    CARD NOTAS
========================= */}
<div className="
  min-h-[380px]
  rounded-2xl
  border border-blue-200 dark:border-blue-900
  bg-blue-50/60 dark:bg-blue-950/20
  p-5 flex flex-col
">

  <h3 className="
    text-sm font-bold
    text-blue-700 dark:text-blue-300
    mb-4
  ">
    DATOS EXTRAÍDOS DE NOTAS
  </h3>

  <div className="
    flex-1 overflow-auto
    border-2 border-dashed
    border-blue-300 dark:border-blue-800
    rounded-2xl
    bg-white/60 dark:bg-gray-900/40
    p-4
  ">

    {notas.length === 0 ? (

      <div className="
        h-full flex items-center justify-center
        text-xs text-gray-500 dark:text-gray-400
      ">
        No existen notas extraídas
      </div>

    ) : (

      <div className="space-y-3">

        {notas.map((nota, index) => (

          <div
            key={index}
            className="
              p-4 rounded-xl
              border border-blue-200 dark:border-blue-800
              bg-white dark:bg-gray-900
            "
          >

            <div className="
              text-[11px]
              font-bold
              text-blue-700 dark:text-blue-300
              mb-3
              uppercase
            ">
              NOTA #{index + 1}
            </div>

            <div className="
              text-xs
              text-gray-700 dark:text-gray-300
              space-y-2
            ">

              {Array.isArray(nota) ? (

                nota.map(
                  (
                    item: string,
                    itemIndex: number
                  ) => (

                    <div
                      key={itemIndex}
                      className="
                        flex gap-2
                        leading-relaxed
                      "
                    >

                      <span className="
                        font-semibold
                        min-w-[18px]
                      ">
                        {itemIndex + 1}.
                      </span>

                      <span className="
                        flex-1
                      ">
                        {item}
                      </span>

                    </div>
                  )
                )

              ) : (

                <div>
                  {String(nota)}
                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>

        {/* =========================
            CARD PROYECTOS
        ========================= */}
        {/* =========================
    CARD PROYECTOS
========================= */}
<div className="
  min-h-[380px]
  rounded-2xl
  border border-purple-200 dark:border-purple-900
  bg-purple-50/60 dark:bg-purple-950/20
  p-5 flex flex-col
">

  <h3 className="
    text-sm font-bold
    text-purple-700 dark:text-purple-300
    mb-4
  ">
    DATOS EXTRAÍDOS DE PROYECTOS
  </h3>

  <div className="
    flex-1 overflow-auto
    border-2 border-dashed
    border-purple-300 dark:border-purple-800
    rounded-2xl
    bg-white/60 dark:bg-gray-900/40
    p-4
  ">

    {proyectos.length === 0 ? (

      <div className="
        h-full flex items-center justify-center
        text-xs text-gray-500 dark:text-gray-400
      ">
        No existen proyectos extraídos
      </div>

    ) : (

      <div className="space-y-4">

        {proyectos.map((proyecto, index) => (

          <div
            key={index}
            className="
              p-4 rounded-xl
              border border-purple-200 dark:border-purple-800
              bg-white dark:bg-gray-900
            "
          >

            <div className="
              text-[11px]
              font-bold
              text-purple-700 dark:text-purple-300
              mb-4
              uppercase
            ">
              PROYECTO #{index + 1} - Codigo: {codigosProyecto || "SIN CÓDIGO"}
            </div>

            {/* =========================
                PLAN TEMÁTICO
            ========================= */}
            <div className="mb-5">

              <div className="
                text-xs font-bold
                text-purple-700 dark:text-purple-300
                mb-2
              ">
                PLAN TEMÁTICO
              </div>

              <div className="
                text-xs
                text-gray-700 dark:text-gray-300
                space-y-2
              ">

                {proyecto.planTematico?.map(
                  (
                    item: string,
                    itemIndex: number
                  ) => (

                    <div
                      key={itemIndex}
                      className="
                        flex gap-2
                        leading-relaxed
                      "
                    >

                      <span className="
                        font-semibold
                        min-w-[18px]
                      ">
                        {itemIndex + 1}.
                      </span>

                      <span className="flex-1">
                        {item}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =========================
                FONDO TIEMPO
            ========================= */}
            <div className="mb-5">

              <div className="
                text-xs font-bold
                text-purple-700 dark:text-purple-300
                mb-2
              ">
                FONDO TIEMPO
              </div>

              <div className="
                text-xs
                text-gray-700 dark:text-gray-300
                space-y-2
              ">

                {proyecto.fondoTiempo?.map(
                  (
                    item: string,
                    itemIndex: number
                  ) => (

                    <div
                      key={itemIndex}
                      className="
                        flex gap-2
                        leading-relaxed
                      "
                    >

                      <span className="
                        font-semibold
                        min-w-[18px]
                      ">
                        {itemIndex + 1}.
                      </span>

                      <span className="flex-1">
                        {item}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =========================
                CRONOGRAMA
            ========================= */}
            <div className="mb-5">

              <div className="
                text-xs font-bold
                text-purple-700 dark:text-purple-300
                mb-2
              ">
                CRONOGRAMA
              </div>

              <div className="
                text-xs
                text-gray-700 dark:text-gray-300
                space-y-2
              ">

                {proyecto.cronograma?.map(
                  (
                    item: string,
                    itemIndex: number
                  ) => (

                    <div
                      key={itemIndex}
                      className="
                        flex gap-2
                        leading-relaxed
                      "
                    >

                      <span className="
                        font-semibold
                        min-w-[18px]
                      ">
                        {itemIndex + 1}.
                      </span>

                      <span className="flex-1">
                        {item}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =========================
                CLAUSTRO DOCENTE
            ========================= */}
            <div>

              <div className="
                text-xs font-bold
                text-purple-700 dark:text-purple-300
                mb-2
              ">
                CLAUSTRO DOCENTE
              </div>

              <div className="
                text-xs
                text-gray-700 dark:text-gray-300
                space-y-2
              ">

                {proyecto.claustroDocente?.map(
                  (
                    item: string,
                    itemIndex: number
                  ) => (

                    <div
                      key={itemIndex}
                      className="
                        flex gap-2
                        leading-relaxed
                      "
                    >

                      <span className="
                        font-semibold
                        min-w-[18px]
                      ">
                        {itemIndex + 1}.
                      </span>

                      <span className="flex-1">
                        {item}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>

      </div>

      {/* =========================
          BOTONES
      ========================= */}
      <div className="
        mt-6 flex flex-wrap
        items-center justify-between gap-4
      ">

        <div className="flex flex-wrap gap-3">

          <button
            onClick={manejarAnalisis}
            disabled={analizando}
            className="
              px-5 py-2 rounded-xl
              bg-blue-600 hover:bg-blue-700
              disabled:opacity-50
              text-white text-xs font-semibold
              transition
            "
          >
            {analizando ? "ANALIZANDO..." : "ANALIZAR Y COMPARAR DATOS"}
          </button>

          <button
            onClick={manejarLimpiarMemoriaProyecto}
            className="
              px-5 py-2 rounded-xl
              bg-red-600 hover:bg-red-700
              text-white text-xs font-semibold
              transition
               cursor-pointer
  disabled:cursor-not-allowed
            "
          >
            LIMPIAR PROYECTO
          </button>

          <button
            onClick={() => {
              if (!reporte) {
                alert("Primero debe analizar los datos");
                return;
              }
              setOpenReporte(true);
            }}
            className="
              px-5 py-2 rounded-xl
              bg-emerald-600 hover:bg-emerald-700
              text-white text-xs font-semibold
              transition
               cursor-pointer
  disabled:cursor-not-allowed
            "
          >
            VER REPORTES
          </button>

        </div>

        <button
          onClick={() => setOpenModal(false)}
          className="
            px-5 py-2 rounded-xl
            bg-gray-800 hover:bg-black
            text-white text-sm font-medium
            transition
             cursor-pointer
  disabled:cursor-not-allowed
          "
        >
          Salir
        </button>

      </div>

    </div>

  </div>

)}

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



{/* aqui va el modal de reporte analisis */}


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













{/* =========================
    MODAL DATOS EXTRAÍDOS ENTRE NOTAS Y MALLA
========================= */}

{openModal1 && (

  <div className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/50 backdrop-blur-sm
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
          Panel de Datos Extraídos entre notas y mallas
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

       {/* =========================
    CARD NOTAS
========================= */}
<div className="
  min-h-[380px]
  rounded-2xl
  border border-blue-200 dark:border-blue-900
  bg-blue-50/60 dark:bg-blue-950/20
  p-5 flex flex-col
">

  <h3 className="
    text-sm font-bold
    text-blue-700 dark:text-blue-300
    mb-4
  ">
    DATOS EXTRAÍDOS DE NOTAS
  </h3>

  <div className="
    flex-1 overflow-auto
    border-2 border-dashed
    border-blue-300 dark:border-blue-800
    rounded-2xl
    bg-white/60 dark:bg-gray-900/40
    p-4
  ">

    {notas.length === 0 ? (

      <div className="
        h-full flex items-center justify-center
        text-xs text-gray-500 dark:text-gray-400
      ">
        No existen notas extraídas
      </div>

    ) : (

      <div className="space-y-3">

        {notas.map((nota, index) => (

          <div
            key={index}
            className="
              p-4 rounded-xl
              border border-blue-200 dark:border-blue-800
              bg-white dark:bg-gray-900
            "
          >

            <div className="
              text-[11px]
              font-bold
              text-blue-700 dark:text-blue-300
              mb-3
              uppercase
            ">
              NOTA #{index + 1}
            </div>

            <div className="
              text-xs
              text-gray-700 dark:text-gray-300
              space-y-2
            ">

              {Array.isArray(nota) ? (

                nota.map(
                  (
                    item: string,
                    itemIndex: number
                  ) => (

                    <div
                      key={itemIndex}
                      className="
                        flex gap-2
                        leading-relaxed
                      "
                    >

                      <span className="
                        font-semibold
                        min-w-[18px]
                      ">
                        {itemIndex + 1}.
                      </span>

                      <span className="
                        flex-1
                      ">
                        {item}
                      </span>

                    </div>
                  )
                )

              ) : (

                <div>
                  {String(nota)}
                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>

        {/* =========================
  {/* =========================
    CARD DE MALLAS
========================= */}
<div
  className="
    min-h-[380px]
    rounded-2xl
    border border-purple-200 dark:border-purple-900
    bg-purple-50/60 dark:bg-purple-950/20
    p-5 flex flex-col
  "
>
  <div
    className="
      flex items-center justify-between
      mb-4 gap-4
    "
  >
    <h3
      className="
        text-sm font-bold
        text-purple-700 dark:text-purple-300
      "
    >
      DATOS EXTRAÍDOS DE MALLAS
    </h3>

    <input
      type="text"
      value={codigoMalla}
      placeholder="Buscar con código"
      onChange={(e) =>
        setCodigoMalla(
          e.target.value
        )
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          buscarMallaPorCodigo(
            codigoMalla
          );
        }
      }}
      className="
        w-64
        px-3 py-2
        text-sm
        rounded-xl
        border border-purple-300
        dark:border-purple-700
        bg-white dark:bg-gray-900
        text-gray-700 dark:text-gray-200
      "
    />
  </div>

  <div
    className="
      flex-1 overflow-auto
      border-2 border-dashed
      border-purple-300 dark:border-purple-800
      rounded-2xl
      bg-white/60 dark:bg-gray-900/40
      p-4
    "
  >
    {loadingMalla ? (

      <div
        className="
          h-full
          flex items-center justify-center
          text-sm text-purple-600
        "
      >
        Extrayendo malla...
      </div>

    ) : mallas.length === 0 ? (

      <div
        className="
          h-full
          flex items-center justify-center
          text-xs
          text-gray-500 dark:text-gray-400
        "
      >
        No existen mallas extraídas
      </div>

    ) : (

      <div className="space-y-2">

  {mallas.map(
    (
      modulo: string,
      index: number
    ) => (

      <div
        key={index}
        className="
          flex gap-3
          text-sm
          text-gray-700 dark:text-gray-300
        "
      >
        <span
          className="
            font-semibold
            min-w-[30px]
          "
        >
          {index + 1}:
        </span>

        <span>
          {modulo}
        </span>

      </div>

    )
  )}

</div>

    )}
  </div>
</div>

      </div>

      {/* =========================
          BOTONES
      ========================= */}
      <div className="
        mt-6 flex flex-wrap
        items-center justify-between gap-4
      ">

        <div className="flex flex-wrap gap-3">

          <button
            onClick={manejarAnalisis1}
            disabled={analizando}
            className="
              px-5 py-2 rounded-xl
              bg-blue-600 hover:bg-blue-700
              disabled:opacity-50
              text-white text-xs font-semibold
              transition
            "
          >
            {analizando ? "ANALIZANDO..." : "ANALIZAR Y COMPARAR DATOS"}
          </button>

          <button
            onClick={manejarLimpiarMemoriaMalla}
            className="
              px-5 py-2 rounded-xl
              bg-red-600 hover:bg-red-700
              text-white text-xs font-semibold
              transition
               cursor-pointer
  disabled:cursor-not-allowed
            "
          >
            LIMPIAR MALLA
          </button>

          <button
            onClick={() => {
              if (!reporte) {
                alert("Primero debe analizar los datos");
                return;
              }
              setOpenReporte1(true);
            }}
            className="
              px-5 py-2 rounded-xl
              bg-emerald-600 hover:bg-emerald-700
              text-white text-xs font-semibold
              transition
               cursor-pointer
  disabled:cursor-not-allowed
            "
          >
            VER REPORTES
          </button>

        </div>

        <button
          onClick={() => setOpenModal1(false)}
          className="
            px-5 py-2 rounded-xl
            bg-gray-800 hover:bg-black
            text-white text-sm font-medium
            transition
             cursor-pointer
  disabled:cursor-not-allowed
          "
        >
          Salir
        </button>

      </div>

    </div>

  </div>

)}

{/* MODAL REPORTES */}
{
  openReporte1 && reporte && (
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
            onClick={() => setOpenReporte1(false)}
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
            onClick={() => setOpenReporte1(false)}
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




















  </div>



);


}

export default MonitoreoPage;