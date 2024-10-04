import React, {useEffect, useState} from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  IconButton,
  Fade,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useQuery, useMutation} from "@apollo/client";
import {GET_ITEMS, DELETE_ITEM, UPDATE_ITEM} from "../../graphql/queries";
import {Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";
import ItemDialog from "../components/ItemDialog";
import {Item} from "../../utils/validateInputs";

const BookPage: React.FC = () => {
  const navigate = useNavigate();
  const {data, refetch} = useQuery(GET_ITEMS);
  const [deleteItem] = useMutation(DELETE_ITEM);
  const [updateItem] = useMutation(UPDATE_ITEM);
  const [books, setBooks] = useState<
    {
      id: string;
      title: string;
      author: string;
      description: string;
      tags: string[];
    }[]
  >([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    id: "",
    title: "",
    description: "",
    tags: [],
    type: "Books",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState({title: "", description: "", tags: ""});

  useEffect(() => {
    if (data) {
      const booksData = data.items.filter(
        (item: {
          id: string;
          title: string;
          author: string;
          description: string;
          type: string;
          tags: string[];
        }) => item.type === "Books"
      );
      setBooks(booksData);
    }
  }, [data]);

  const handleBookClick = (id: string) => {
    navigate(`/detail/${id}?type=book`);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setNewItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteItem({variables: {id}});
    refetch();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      id: "",
      title: "",
      description: "",
      tags: [],
      type: "Books",
    });
    setErrors({title: "", description: "", tags: ""});
  };

  const handleDialogSubmit = async () => {
    if (editingItem) {
      await updateItem({variables: {id: newItem.id, input: newItem}});
    }
    refetch();
    handleDialogClose();
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          Books ({books.length})
        </Typography>
        <Grid container spacing={3}>
          {books.map((book, index) => (
            <Fade in={true} timeout={500 * (index + 1)} key={book.id}>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {transform: "scale(1.05)"},
                    cursor: "pointer",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                  onClick={() => handleBookClick(book.id)}
                >
                  <Typography variant="h6" gutterBottom color="primary">
                    {book.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {truncateDescription(book.description, 100)}
                  </Typography>
                  <Box sx={{mt: 2}}>
                    {book.tags.map((tag, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{
                          mr: 1,
                          backgroundColor: "primary.main",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                  <Box
                    sx={{mt: 2, display: "flex", justifyContent: "flex-end"}}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit({
                          ...book,
                          type: "Books",
                        });
                      }}
                      sx={{mr: 1}}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(book.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Fade>
          ))}
        </Grid>
      </Container>
      <ItemDialog
        open={dialogOpen}
        editingItem={editingItem}
        newItem={newItem}
        setNewItem={setNewItem}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        errors={errors}
      />
    </Box>
  );
};

export default BookPage;
