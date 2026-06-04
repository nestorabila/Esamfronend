import { useEffect, useState } from "react";

import type { Inscritos } from "../model/Inscritos";

import {

  obtenerInscritos,

  extraerProyectoPrograma,

  listarProyectosPrograma,

  limpiarProyectosPrograma,



} from "../services/inscritosServive";
import { extraerMalla, obtenerProgramas } from "../services/programaService";
import type { Programa } from "../model/programa";

function SumarespecialidadPage() {

// aqui umentar metood de busacas y todo relaciondo a mallas no queor que mezcle

const limpiarMallas = () => {

  setMallasExtraidas([]);

  setElementosComparar(
    (prev) =>
      prev.filter(
        (item) =>
          !item.startsWith(
            "MALLA "
          )
      )
  );

};

const [mallasExtraidas,
  setMallasExtraidas] =
  useState<
    {
      programa: Programa;
      modulos: string[];
    }[]
  >([]);

const [loadingMalla,
  setLoadingMalla] =
  useState<string | null>(null);

const seleccionarMalla = async (
  malla: Programa
) => {

  try {

    setLoadingMalla(
      malla.codAcadem
    );

    console.log(
      "MALLA SELECCIONADA:",
      malla
    );

    const respuesta =
      await extraerMalla(
        malla.linkMalla
      );

    console.log(
      "MODULOS EXTRAIDOS",
      respuesta
    );

    setMallasExtraidas(
      (prev) => [

        ...prev,

        {
          programa: malla,
          modulos:
            respuesta.data || []
        }

      ]
    );

  } catch (error) {

    console.error(
      "Error extrayendo malla",
      error
    );

  } finally {

    setLoadingMalla(null);

  }

};
// =========================
// MALLAS
// =========================

const [mallas, setMallas] =
  useState<Programa[]>([]);

const [textoBusquedaMalla,
  setTextoBusquedaMalla] =
  useState("");

const [mallasEncontradas,
  setMallasEncontradas] =
  useState<Programa[]>([]);


  const cargarMallas = async () => {

  try {

    const datos =
      await obtenerProgramas();

    setMallas(datos);

  } catch (error) {

    console.error(
      "Error cargando mallas",
      error
    );

  }

};


const normalizarTexto1 = (
  texto: string
) => {

  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

};



const buscarMallas = () => {

  console.log("================================");
  console.log("BUSCAR MALLAS");

  const busqueda =
    normalizarTexto1(
      textoBusquedaMalla
    );

  console.log("Texto original:", textoBusquedaMalla);
  console.log("Texto normalizado:", busqueda);

  console.log(
    "Cantidad de mallas:",
    mallas.length
  );

  if (!busqueda) {

    console.log(
      "Busqueda vacia"
    );

    setMallasEncontradas([]);

    return;
  }

  const resultados =
    mallas.filter((malla) => {

      const nombrePrograma =
        normalizarTexto1(
          malla.nuevoPrograma
        );

      return nombrePrograma.includes(
        busqueda
      );

    });

  console.log(
    "Resultados encontrados:",
    resultados.length
  );

  console.log(
    "Primeros resultados:",
    resultados.slice(0, 5)
  );

  setMallasEncontradas(
    resultados
  );

};
// =========================
// FIN MALLAS
// =========================









const [
  elementosComparar,
  setElementosComparar
] = useState<string[]>([]);

const manejarCheckboxComparacion = (
  nombre: string
) => {

  setElementosComparar(
    (prev) => {

      if (
        prev.includes(nombre)
      ) {

        return prev.filter(
          (item) =>
            item !== nombre
        );

      }

      return [
        ...prev,
        nombre
      ];

    }
  );

};

const normalizarComparacion = (
  texto: string
) => {

  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

};


// const compararListas = (
//   nombreA: string,
//   listaA: string[],
//   nombreB: string,
//   listaB: string[]
// ) => {

//   const filas = [];

//   const total =
//     Math.max(
//       listaA.length,
//       listaB.length
//     );

//   for (
//     let i = 0;
//     i < total;
//     i++
//   ) {

//     const textoA =
//       listaA[i] || "";

//     const textoB =
//       listaB[i] || "";

//     const iguales =

//       normalizarComparacion(
//         textoA
//       ) ===

//       normalizarComparacion(
//         textoB
//       );

//     filas.push({

//       fila: i + 1,

//       estado:
//         iguales
//           ? "IDENTICO"
//           : "DIFERENTE",

//       tieneFaltantes:
//         !textoA ||
//         !textoB,

//       registros: [

//         {
//           origen: nombreA,
//           texto: textoA
//         },

//         {
//           origen: nombreB,
//           texto: textoB
//         }

//       ]

//     });

//   }

//   return filas;

// };

const obtenerDatosComparacion = (
  nombre: string
) => {

  if (
    nombre.startsWith("MALLA")
  ) {

    const indice =
      Number(
        nombre.replace(
          "MALLA ",
          ""
        )
      ) - 1;

    return (
      mallasExtraidas[
        indice
      ]?.modulos || []
    );
  }

  const proyecto =
    proyectos[0];

  if (!proyecto)
    return [];

  switch (nombre) {

    case "PLAN TEMATICO":
      return (
        proyecto.planTematico
        || []
      );

    case "FONDO TIEMPO":
      return (
        proyecto.fondoTiempo
        || []
      );

    case "CRONOGRAMA":
      return (
        proyecto.cronograma
        || []
      );

    case "CLAUSTRO DOCENTE":
      return (
        proyecto.claustroDocente
        || []
      );

    default:
      return [];

  }

};


const manejarAnalisis =
  async () => {

    try {

      setAnalizando(
        true
      );

      if (
        elementosComparar.length < 2
      ) {

        alert(
          "Seleccione al menos 2 elementos"
        );

        return;
      }

      const nombres =
  elementosComparar;

const listas =
  elementosComparar.map(
    nombre =>
      obtenerDatosComparacion(
        nombre
      )
  );

const filas =
  compararMultiplesListas(
    nombres,
    listas
  );
      setReporte({

        reporte: filas

      });

      setOpenReporte(
        true
      );

    } catch (error) {

      console.log(error);

    } finally {

      setAnalizando(
        false
      );

    }

  };





const compararMultiplesListas = (
  nombres: string[],
  listas: string[][]
) => {

  const filas = [];

  const totalFilas =
    Math.max(
      ...listas.map(
        lista => lista.length
      )
    );

  for (
    let i = 0;
    i < totalFilas;
    i++
  ) {

    const registros =
      nombres.map(
        (
          nombre,
          index
        ) => ({

          origen: nombre,

          texto:
            listas[index][i]
            || ""

        })
      );

    const valores =
      registros.map(
        r =>
          normalizarComparacion(
            r.texto
          )
      );

    const todosIguales =
      valores.every(
        valor =>
          valor === valores[0]
      );

    filas.push({

      fila: i + 1,

      estado:
        todosIguales
          ? "IDENTICO"
          : "DIFERENTE",

      tieneFaltantes:
        registros.some(
          r => !r.texto
        ),

      registros

    });

  }

  return filas;

};












//  y aqui debe terminar


  const [programas, setProgramas] =
    useState<Inscritos[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [openModal, setOpenModal] =
    useState(false);

  // const [openModal1, setOpenModal1] =
  //   useState(false);

  // const [programaSeleccionado,
  //   setProgramaSeleccionado] =
  //   useState("");

  const [programasFiltrados,
    setProgramasFiltrados] =
    useState<Inscritos[]>([]);

  const [mensaje, setMensaje] =
    useState("");

  const [tipoMensaje,
    setTipoMensaje] =
    useState<"success" | "error" | "">("");

  const [loadingProyecto,
    setLoadingProyecto] =
    useState<string | null>(null);

  const [proyectos,
    setProyectos] =
    useState<any[]>([]);

  const [reporte,
    setReporte] =
    useState<any>(null);

  const [analizando,
    setAnalizando] =
    useState(false);

  const [openReporte,
    setOpenReporte] =
    useState(false);

  // const [openReporte1,
  //   setOpenReporte1] =
  //   useState(false);

  // =========================
  // NORMALIZAR TEXTO
  // =========================

  const normalizarTexto = (
    texto: string
  ) => {

    return texto
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /\./g,
        ""
      )
      .trim()
      .replace(
        /\s+/g,
        " "
      )
      .toLowerCase();
  };

  // =========================
  // FILTRO
  // =========================

  // const programasUnicos = [

  //   ...new Set(

  //     programas.map(
  //       (item) =>
  //         item.programa
  //     )

  //   )

  // ];

  //nuevos flitros aplicado------
const [codigoSeleccionado,
  setCodigoSeleccionado] =
  useState("");

const [versionSeleccionada,
  setVersionSeleccionada] =
  useState("");


  const versionesUnicas = [

  ...new Set(

    programas
      .map(
        (item) =>
          item.version?.trim()
      )
      .filter(Boolean)

  )

];


const aplicarFiltros = (
  codigo: string,
  version: string
) => {

  setCodigoSeleccionado(
    codigo
  );

  setVersionSeleccionada(
    version
  );

  let filtrados =
    [...programas];

  // =========================
  // FILTRO CODIGO
  // =========================

  if (
    codigo.trim() !== ""
  ) {

    filtrados =
      filtrados.filter(
        (item) =>

          item.codAcadem
            ?.toLowerCase()
            .includes(
              codigo
                .trim()
                .toLowerCase()
            )
      );
  }

  // =========================
  // FILTRO VERSION
  // =========================

  if (
    version !== ""
  ) {

    filtrados =
      filtrados.filter(
        (item) =>

          normalizarTexto(
            item.version
          ) ===

          normalizarTexto(
            version
          )
      );
  }

  setProgramasFiltrados(
    filtrados
  );
};

  // =========================
  // CARGAR PROGRAMAS
  // =========================

  const cargarProgramas =
    async () => {

      try {

        const data =
          await obtenerInscritos();

        setProgramas(
          data
        );

        setProgramasFiltrados(
          data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    cargarProgramas();
    cargarMallas();


  }, []);

  // =========================
  // CHECKBOX RESULTADO
  // =========================

  
  // =========================
  // PROYECTO
  // =========================

  const [
    codigosProyecto,
    setCodigosProyecto
  ] = useState<string[]>(
    []
  );

  const manejarExtraerProyecto =
    async (
      link: string,
      codAcadem: string
    ) => {

      try {

        setLoadingProyecto(
          link
        );

        if (
          !link ||
          link.trim() === ""
        ) {

          setTipoMensaje(
            "error"
          );

          setMensaje(
            "No se pudo extraer proyecto."
          );

          setTimeout(
            () => {

              setMensaje("");

              setTipoMensaje(
                ""
              );

            },
            4000
          );

          return;
        }

        await extraerProyectoPrograma(
          link
        );

        setCodigosProyecto([
          codAcadem
        ]);

        await cargarProyectos();
        setElementosComparar(
  (prev) => [

    ...prev,

    "PLAN TEMATICO",
    "FONDO TIEMPO",
    "CRONOGRAMA",
    "CLAUSTRO DOCENTE"

  ].filter(
    (item, index, arr) =>
      arr.indexOf(item) === index
  )
);

        setTipoMensaje(
          "success"
        );

        setMensaje(
          "Proyecto extraído correctamente."
        );

        setTimeout(
          () => {

            setMensaje("");

            setTipoMensaje(
              ""
            );

          },
          3000
        );

      } catch (error) {

        console.log(error);

        setTipoMensaje(
          "error"
        );

        setMensaje(
          "Error al extraer proyecto."
        );

      } finally {

        setLoadingProyecto(
          null
        );
      }
    };

  const cargarProyectos =
    async () => {

      try {

        const res =
          await listarProyectosPrograma();

        setProyectos(
          res.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  // =========================
  // ANALISIS
  // =========================

  // const manejarAnalisis =
  //   async () => {

  //     try {

  //       setAnalizando(
  //         true
  //       );

  //       const res =
  //         await analizarPrograma();

  //       setReporte(
  //         res
  //       );

  //       alert(
  //         "Análisis completado"
  //       );

  //     } catch (error) {

  //       console.log(error);

  //       alert(
  //         "Error en análisis"
  //       );

  //     } finally {

  //       setAnalizando(
  //         false
  //       );
  //     }
  //   };

  // =========================
  // LIMPIAR MEMORIA
  // =========================

  // =========================
  // LIMPIAR TODO
  // =========================

  const limpiarTodo =
    async () => {

      try {

        await limpiarProyectosPrograma();

        setProyectos([]);

        setReporte(
          null
        );
setElementosComparar(
  (prev) =>
    prev.filter(
      (item) =>

        item !== "PLAN TEMATICO" &&
        item !== "FONDO TIEMPO" &&
        item !== "CRONOGRAMA" &&
        item !== "CLAUSTRO DOCENTE"
    )
);
        setTipoMensaje(
          "success"
        );

        setMensaje(
          "Datos limpiados correctamente."
        );

      } catch (error) {

        console.log(error);

        setTipoMensaje(
          "error"
        );

        setMensaje(
          "Error al limpiar datos."
        );
      }
    };

 return (
  <div className="max-w-[1700px] mx-auto">

  {/* HEADER */}

  <div className="mb-5">

    <h1
      className="
      text-2xl font-bold
      text-gray-800 dark:text-white
    "
    >
      Inscritos
    </h1>

    <p
      className="
      text-sm
      text-gray-500 dark:text-gray-400
      mt-1
    "
    >
      Total registros: {programas.length}
    </p>

    {/* FILTROS + BOTONES */}

    <div className="flex flex-wrap items-end gap-3">

      <div className="flex flex-col">

  <label
    className="
      text-[11px]
      font-medium
      text-gray-600 dark:text-gray-400
      mb-1
    "
  >
    Buscar por código
  </label>

  <input
    type="text"
    value={codigoSeleccionado}
    onChange={(e) =>
      setCodigoSeleccionado(
        e.target.value
      )
    }
    onKeyDown={(e) => {

      if (
        e.key === "Enter"
      ) {

        aplicarFiltros(
          codigoSeleccionado,
          versionSeleccionada
        );
      }
    }}
    placeholder="Ingrese código..."
    className="
      w-[220px]
      px-3 py-2
      text-xs
      rounded-lg
      border border-gray-300 dark:border-gray-700
      bg-white dark:bg-gray-900
      text-gray-700 dark:text-gray-200
    "
  />

</div>


<div className="flex flex-col">

  <label
    className="
      text-[11px]
      font-medium
      text-gray-600 dark:text-gray-400
      mb-1
    "
  >
    Filtrar por versión
  </label>

  <select
    value={versionSeleccionada}
    onChange={(e) =>
      aplicarFiltros(
        codigoSeleccionado,
        e.target.value
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
    "
  >

    <option value="">
      Todas las versiones
    </option>

    {versionesUnicas.map(
      (
        version,
        index
      ) => (

        <option
          key={index}
          value={version}
        >
          {version}
        </option>

      )
    )}

  </select>

</div>


      {/* <button
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
      </button> */}

      <button
        onClick={() =>
          setOpenModal(true)
        }
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

    </div>

  </div>

  {/* LOADING */}

  {loading ? (

    <div className="flex justify-center items-center h-40">

      <p
        className="
        text-sm
        text-gray-600 dark:text-gray-300
      "
      >
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

      <table
        className="
        w-full
        text-xs
        border-collapse
      "
      >

        <thead
          className="
          sticky top-0 z-10
          bg-gray-200 dark:bg-gray-800
          text-gray-700 dark:text-gray-200
        "
        >

          <tr>

            <th className="px-3 py-2 text-left">
              Código
            </th>

            <th className="px-3 py-2 text-left min-w-[450px]">
              Programa
            </th>

            <th className="px-3 py-2 text-left">
              Versión
            </th>

            <th className="px-3 py-2 text-left">
              Sede
            </th>

            <th className="px-3 py-2 text-left">
              Nro. Módulos
            </th>

            <th className="px-3 py-2 text-center">
              Acción
            </th>

          </tr>

        </thead>

        <tbody>

          {programasFiltrados.map(
            (item, index) => (

              <tr
                key={index}
                className="
                border-t
                border-gray-200 dark:border-gray-800
                hover:bg-gray-50
                dark:hover:bg-gray-800/60
              "
              >

                {/* CODIGO */}

                <td
                  className="
                  px-3 py-2
                  font-medium
                  text-gray-700 dark:text-gray-200
                "
                >
                  {item.codAcadem}
                </td>

                {/* PROGRAMA */}

                <td
                  className="
                  px-3 py-2
                  text-gray-700 dark:text-gray-300
                  leading-5
                "
                >
                  {item.programa}
                </td>

                {/* VERSION */}

                <td className="px-3 py-2">

                  <span
                    onClick={() =>
                      item.linkPy &&
                      window.open(
                        item.linkPy,
                        "_blank"
                      )
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
                    "
                  >
                    {item.version}
                  </span>

                </td>

                {/* SEDE */}

                <td
                  className="
                  px-3 py-2
                  text-gray-700 dark:text-gray-300
                "
                >
                  {item.sede}
                </td>

                {/* NRO MODULOS */}

                <td
                  className="
                  px-3 py-2
                  text-gray-700 dark:text-gray-300
                "
                >
                  {item.nroModulos}
                </td>

                {/* BOTON */}

                <td className="px-3 py-2">

                  <div className="flex justify-center">

                    <button
                      onClick={() =>
                        manejarExtraerProyecto(
                          item.linkPy,
                          item.codAcadem
                        )
                      }
                      disabled={
                        loadingProyecto ===
                        item.linkPy
                      }
                      className="
                        px-3 py-1
                        rounded-md
                        border border-gray-300
                        dark:border-gray-700
                        text-gray-700 dark:text-gray-200
                        text-[11px]
                        hover:bg-gray-100
                        dark:hover:bg-gray-700
                        transition
                        cursor-pointer
                        disabled:opacity-60
                        flex items-center gap-2
                      "
                    >

                      {loadingProyecto === item.linkPy ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />

                            <path
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

            )
          )}

        </tbody>

      </table>

    </div>

 

)}

{openModal && (

  <div className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/50 backdrop-blur-sm
    p-4
  ">

    <div className="
      w-full max-w-[1600px]
      max-h-[92vh]
      overflow-y-auto
      rounded-3xl
      border border-gray-200 dark:border-gray-800
      bg-white dark:bg-gray-900
      shadow-2xl
      p-6
    ">

      {/* HEADER */}
      <div className="mb-5">

        <h2 className="
          text-xl font-bold
          text-gray-800 dark:text-white
        ">
          Panel de Datos Extraídos
        </h2>

        <p className="
          mt-1
          text-xs
          text-gray-500 dark:text-gray-400
        ">
          Gestión y análisis de información procesada
        </p>

      </div>

      {/* CONTENIDO — 3 COLUMNAS HORIZONTALES */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-5
        items-start
      ">

        {/* =========================
            COLUMNA 1 — BUSCADOR
        ========================= */}
        <div className="
          min-h-[420px]
          rounded-2xl
          border border-emerald-200 dark:border-emerald-900
          bg-emerald-50/60 dark:bg-emerald-950/20
          p-5 flex flex-col
        ">

          <h3 className="
            text-xs font-bold
            text-emerald-700 dark:text-emerald-300
            mb-4
          ">
            BÚSQUEDA DE MALLAS
          </h3>

          {/* BUSCADOR */}
          <input
            type="text"
            value={textoBusquedaMalla}
            onChange={(e) =>
              setTextoBusquedaMalla(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                buscarMallas();

              }

            }}
            placeholder="Buscar programa..."
            className="
              w-full
              mb-4
              px-4 py-2
              rounded-xl
              border
              text-gray-900 dark:text-white
              border-emerald-300
              dark:border-emerald-800
              bg-white dark:bg-gray-900
              text-xs
              outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          />

          {/* RESULTADOS DE BÚSQUEDA */}
          <div className="
            flex-1
            overflow-y-auto
            space-y-3
          ">

            {mallasEncontradas.length > 0 ? (

              mallasEncontradas.map(
                (
                  malla,
                  index
                ) => (

                  <div
                   key={index}
  onClick={() => {

  if (
    loadingMalla !==
    malla.codAcadem
  ) {

    seleccionarMalla(
      malla
    );

  }

}}
                  
                    className="
                      p-4
                      rounded-xl
                      border
                      border-emerald-200
                      dark:border-emerald-800
                      bg-white
                      dark:bg-gray-900
                      shadow-sm
                      hover:shadow-md
                      transition
                      cursor-pointer
                    "
                  >

                    {/* NOMBRE */}
                   {/* NOMBRE */}
<div className="
  text-[11px]
  font-semibold
  text-emerald-700
  dark:text-emerald-300
  leading-relaxed
">
  {malla.nuevoPrograma}
</div>

{loadingMalla ===
  malla.codAcadem && (

  <div className="
    mt-2
    flex items-center
    gap-2
    text-[10px]
    text-blue-600
    dark:text-blue-400
  ">

    <div className="
      h-3
      w-3
      rounded-full
      border-2
      border-blue-500
      border-t-transparent
      animate-spin
    " />

    <span>
      Extrayendo malla...
    </span>

  </div>

)}

                    {/* DATOS */}
                    <div className="
                      mt-3
                      flex flex-wrap
                      gap-2
                    ">

                      <span className="
                        text-[10px]
                        px-2 py-1
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        dark:bg-blue-900/30
                        dark:text-blue-300
                      ">
                        {malla.sede}
                      </span>

                      <span className="
                        text-[10px]
                        px-2 py-1
                        rounded-full
                        bg-purple-100
                        text-purple-700
                        dark:bg-purple-900/30
                        dark:text-purple-300
                      ">
                        {malla.tipo}
                      </span>

                      <span className="
                        text-[10px]
                        px-2 py-1
                        rounded-full
                        bg-amber-100
                        text-amber-700
                        dark:bg-amber-900/30
                        dark:text-amber-300
                      ">
                        Versión {malla.version}
                      </span>

                    </div>

                  </div>

                )
              )

            ) : (

              <div className="
                h-full
                flex items-center justify-center
                text-[11px]
                text-gray-900 dark:text-white
                text-center
              ">
                Escriba un nombre de programa y presione Enter
              </div>

            )}

          </div>

        </div>

  {/* =========================
    COLUMNA 2 — CARD MALLAS
========================= */}
<div
  className="
    min-h-[420px]
    rounded-2xl
    border border-emerald-200 dark:border-emerald-900
    bg-emerald-50/60 dark:bg-emerald-950/20
    p-5 flex flex-col
  "
>

  <h3
    className="
      text-xs font-bold
      text-emerald-700 dark:text-emerald-300
      mb-4
    "
  >
    INFORMACIÓN DE MALLA
  </h3>

  <div
    className="
      flex-1
      overflow-auto
      border-2 border-dashed
      border-emerald-300 dark:border-emerald-800
      rounded-2xl
      bg-white/60 dark:bg-gray-900/40
      p-4
    "
  >

    {mallasExtraidas.length === 0 ? (

      <div
        className="
          h-full
          flex items-center justify-center
          text-[11px]
          text-gray-500
          dark:text-gray-400
          text-center
        "
      >
        Seleccione una malla para visualizar su información
      </div>

    ) : (

      <div className="w-full space-y-5">

        {mallasExtraidas.map(
          (
            item,
            index
          ) => (

            <div
              key={index}
              className="
                w-full
                border-b
                border-emerald-200
                dark:border-emerald-800
                pb-4
              "
            >
<div
  className="
    flex items-center
    gap-2
    mb-3
  "
>

  <input
    type="checkbox"
      checked={
    elementosComparar.includes(
      `MALLA ${index + 1}`
    )
  }
  onChange={() =>
    manejarCheckboxComparacion(
      `MALLA ${index + 1}`
    )
  }
    className="
      w-4 h-4
      cursor-pointer
      accent-emerald-600
    "
  />

  <div
    className="
      text-xs
      font-bold
      text-emerald-700
      dark:text-emerald-300
    "
  >
    MALLA {index + 1}
  </div>

</div>
              <div
                className="
                  w-full
                  text-[11px]
                  text-gray-700
                  dark:text-gray-300
                  text-left
                  space-y-2
                "
              >

                {item.modulos.map(
                  (
                    modulo,
                    moduloIndex
                  ) => (

                    <div
                      key={moduloIndex}
                      className="
                        w-full
                        leading-relaxed
                        break-words
                      "
                    >
                      <span className="font-semibold">
                        {moduloIndex + 1}.
                      </span>{" "}
                      {modulo}
                    </div>

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>

    )}

  </div>

</div>
        {/* =========================
            COLUMNA 3 — CARD PROYECTOS
        ========================= */}
        <div className="
          min-h-[420px]
          rounded-2xl
          border border-purple-200 dark:border-purple-900
          bg-purple-50/60 dark:bg-purple-950/20
          p-5 flex flex-col
        ">

          <h3 className="
            text-xs font-bold
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
                text-[11px] text-gray-500 dark:text-gray-400
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
                      text-[10px]
                      font-bold
                      text-purple-700 dark:text-purple-300
                      mb-4
                      uppercase
                    ">
                      PROYECTO #{index + 1} - Código: {codigosProyecto[0] || "SIN CÓDIGO"}
                    </div>

                    {/* PLAN TEMÁTICO */}
                    <div className="mb-5">

                     <div
  className="
    flex items-center
    gap-2
    mb-2
  "
>

  <input
    type="checkbox"
     checked={
    elementosComparar.includes(
      "PLAN TEMATICO"
    )
  }
  onChange={() =>
    manejarCheckboxComparacion(
      "PLAN TEMATICO"
    )
  }
    className="
      w-4 h-4
      cursor-pointer
      accent-purple-600
    "
  />

  <div
    className="
      text-[11px]
      font-bold
      text-purple-700
      dark:text-purple-300
    "
  >
    PLAN TEMÁTICO
  </div>

</div>

                      <div className="
                        text-[11px]
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

                    {/* FONDO TIEMPO */}
                    <div className="mb-5">

                    <div
  className="
    flex items-center
    gap-2
    mb-2
  "
>

  <input
    type="checkbox"
     checked={
    elementosComparar.includes(
      "FONDO TIEMPO"
    )
  }
  onChange={() =>
    manejarCheckboxComparacion(
      "FONDO TIEMPO"
    )
  }
    className="
      w-4 h-4
      cursor-pointer
      accent-purple-600
    "
  />

  <div
    className="
      text-[11px]
      font-bold
      text-purple-700
      dark:text-purple-300
    "
  >
    FONDO TIEMPO
  </div>

</div>

                      <div className="
                        text-[11px]
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

                    {/* CRONOGRAMA */}
                    <div className="mb-5">

                      <div
  className="
    flex items-center
    gap-2
    mb-2
  "
>

  <input
    type="checkbox"
      checked={
    elementosComparar.includes(
      "CRONOGRAMA"
    )
  }
  onChange={() =>
    manejarCheckboxComparacion(
      "CRONOGRAMA"
    )
  }
    className="
      w-4 h-4
      cursor-pointer
      accent-purple-600
    "
  />

  <div
    className="
      text-[11px]
      font-bold
      text-purple-700
      dark:text-purple-300
    "
  >
    CRONOGRAMA
  </div>

</div>

                      <div className="
                        text-[11px]
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

                    {/* CLAUSTRO DOCENTE */}
                    <div>

                     <div
  className="
    flex items-center
    gap-2
    mb-2
  "
>

  <input
    type="checkbox"
     checked={
    elementosComparar.includes(
      "CLAUSTRO DOCENTE"
    )
  }
  onChange={() =>
    manejarCheckboxComparacion(
      "CLAUSTRO DOCENTE"
    )
  }
    className="
      w-4 h-4
      cursor-pointer
      accent-purple-600
    "
  />

  <div
    className="
      text-[11px]
      font-bold
      text-purple-700
      dark:text-purple-300
    "
  >
    CLAUSTRO DOCENTE
  </div>

</div>

                      <div className="
                        text-[11px]
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

      {/* BOTONES */}
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
            {analizando ? "ANALIZANDO..." : "ANALIZAR DATOS SELECCIONADOS"}
          </button>

           <button
            onClick={limpiarMallas}
            className="
              px-5 py-2 rounded-xl
              bg-red-600 hover:bg-red-700
              text-white text-xs font-semibold
              transition
            "
          >
            LIMPIAR MALLA
          </button>

          <button
            onClick={limpiarTodo}
            className="
              px-5 py-2 rounded-xl
              bg-red-600 hover:bg-red-700
              text-white text-xs font-semibold
              transition
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

{/* 
mensaje para mostrar---------------  */}
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

export default SumarespecialidadPage;