import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: "Arquivo Obrigatorio",
      validate: {
        //10485760  actual 101757
        lessThan10MB: (file) => parseInt(file[0].size) < 10485760, //<10 false = error   >10 true
        acceptedFormats: file => file[0].type == "image/jpeg" || file[0].type == "image/png" || file[0].type == "image/gif", // image/jpeg, image/png ou image/gif
      }


    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: "titulo obrigatorio",
      minLength: {
        value:2,
        message: "Mínimo de 2 caracteres" 
      },
      maxLength: {
        value: 20,
        message: "Máximo de 20 caracteres"
      },

    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: 'descrição obrigatorio',
      maxLength: {
        value: 65,
        message: "Máximo de 65 caracteres"
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (data) => {
      const response = await api.post('/api/images', {
        url: imageUrl,
        title: data.title,
        description: data.description
      })
      return response.data
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {

    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if(!imageUrl) {
        toast({
          title: "Imagem não adicionada",
          description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
        })
        return
      } else {
        // TODO EXECUTE ASYNC MUTATION
        
        await mutation.mutateAsync(data)
        // TODO SHOW SUCCESS TOAST
        toast({
          title: "Imagem adicionada",
          description: "Sua imagem foi cadastrada com sucesso.",
        })
        return 
      }

    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
      })
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      closeModal();
    }
  };


  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error = {errors.image}
          // name="file"
          // TODO SEND IMAGE ERRORS
          // error = {
          //   errors.file?.type === 'required' && {type: 'required', message: "Arquivo obrigatório"} ||
          //   errors.file?.type === "lessThan10MB" && {type: "lessThan10MB", message: "O arquivo deve ser menor que 10MB"} ||
          //   errors.file?.type === "acceptedFormats" && {type: "acceptedFormats", message: "Somente são aceitos arquivos PNG, JPEG e GIF"}
          // }
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS

          {...register("image", formValidations.image)}
        />
  
        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          // name = "title"
          error = {errors.title}
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS

          {...register("title", formValidations.title)}
        />


        <TextInput
          placeholder="Descrição da imagem..."
          // TODO SEND DESCRIPTION ERRORS
          // name="description"
          error = {errors.description}
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS

          {...register("description", formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
     

    </Box>


  );



}


