import React, { memo } from "react";
import AddButton from "./AddButton";
import RemoveButton from "./RemoveButton";

const TableLike = memo(
  ({ title, headers, rows, renderRow, onAdd, onRemove }) => (
    <div
      className="tablelike"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        className="tablelike__table"
        style={{ width: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          className="tablelike__row tablelike__row--header"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            background: "#0e134b",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
          }}
        >

          {headers.map((h, i) => {
          const isProjectImage = title === "projects" && h === "Image";
          return (
            <div
              key={i}
              className="tablelike__cell"
              style={
                isProjectImage
                  ? { width: 100, textAlign: "center" }
                  : { flex: 1, textAlign: "center" }
              }
            >
              {h}
            </div>
          );
        })}


          <div className="tablelike__cell" style={{ width: "50px" }} />
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div
            className="tablelike__row"
            key={row.id}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f8fafc",
              padding: "8px",
              borderRadius: "6px",
            }}
          >
            <div style={{ display: "flex", flex: 1, gap: "8px" }}>
              {renderRow(row)}
            </div>

            <div
              style={{
                width: "50px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <RemoveButton onClick={() => onRemove(row.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Add */}
      <div className="tablelike__head">
        <AddButton onClick={onAdd} />
      </div>
    </div>
  )
);

export default TableLike;